import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

export interface LocalTrack {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
  duration?: number;
  isLocal: boolean;
  folder: string;
}

const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.aac', '.ogg', '.flac', '.wma'];

class LocalFileService {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      const apiLevel = Platform.Version;
      if (typeof apiLevel === 'number' && apiLevel >= 33) {
        const granted = await PermissionsAndroid.request(
          'android.permission.READ_MEDIA_AUDIO' as any
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Erreur lors de la demande de permissions :', err);
      return false;
    }
  }

  // Recursively scan a directory for audio files
  private async scanDirectory(path: string, tracks: LocalTrack[], depth: number = 0): Promise<void> {
    // Limit depth to avoid going too deep into system folders
    if (depth > 6) return;

    try {
      const exists = await RNFS.exists(path);
      if (!exists) return;

      const files = await RNFS.readDir(path);

      for (const file of files) {
        if (file.isFile()) {
          const lowerName = file.name.toLowerCase();
          const isAudio = AUDIO_EXTENSIONS.some(ext => lowerName.endsWith(ext));
          if (isAudio) {
            const folderName = path.split('/').pop() || 'Inconnu';
            tracks.push({
              id: file.path,
              title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
              artist: 'Fichier local',
              artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
              url: `file://${file.path}`,
              isLocal: true,
              folder: folderName,
            });
          }
        } else if (file.isDirectory()) {
          // Skip system / hidden / Android folders
          const skipDirs = [
            'Android', '.thumbnails', '.cache', 'cache', 'data',
            'obb', 'lost+found', '.Trash', 'DCIM', 'Pictures',
          ];
          if (!file.name.startsWith('.') && !skipDirs.includes(file.name)) {
            await this.scanDirectory(file.path, tracks, depth + 1);
          }
        }
      }
    } catch (error) {
      // Permission denied or unreadable directory — skip silently
    }
  }

  async scanLocalMusic(): Promise<LocalTrack[]> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.log('Permissions de stockage refusées.');
      return [];
    }

    const tracks: LocalTrack[] = [];

    try {
      // Primary scan root: external storage
      const rootPath = RNFS.ExternalStorageDirectoryPath;
      await this.scanDirectory(rootPath, tracks);

      // Also scan internal storage paths commonly used
      const additionalPaths = [
        `${RNFS.DocumentDirectoryPath}`,
        '/storage/emulated/0',
        '/sdcard',
      ];

      for (const p of additionalPaths) {
        if (p !== rootPath) {
          await this.scanDirectory(p, tracks);
        }
      }

      // Remove duplicates by file path
      const uniqueMap = new Map<string, LocalTrack>();
      for (const track of tracks) {
        uniqueMap.set(track.id, track);
      }

      return Array.from(uniqueMap.values());
    } catch (error) {
      console.log('Erreur lors du scan des fichiers locaux :', error);
      return [];
    }
  }

  // Get unique folders that contain audio files
  async getLocalFolders(): Promise<{ name: string; trackCount: number }[]> {
    const tracks = await this.scanLocalMusic();
    const folderMap = new Map<string, number>();

    for (const track of tracks) {
      folderMap.set(track.folder, (folderMap.get(track.folder) || 0) + 1);
    }

    return Array.from(folderMap.entries()).map(([name, trackCount]) => ({
      name,
      trackCount,
    }));
  }

  // Get tracks from a specific folder only
  async getTracksFromFolder(folderName: string): Promise<LocalTrack[]> {
    const allTracks = await this.scanLocalMusic();
    return allTracks.filter(t => t.folder === folderName);
  }
}

export const localFileService = new LocalFileService();
