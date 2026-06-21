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
}

const FALLBACK_LOCAL_TRACKS: LocalTrack[] = [
  {
    id: 'local_1',
    title: 'Offline Vibe',
    artist: 'Sauti Local',
    artwork: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Streaming fallback acting as local file
    isLocal: true,
  },
  {
    id: 'local_2',
    title: 'Campfire Acoustique',
    artist: 'Guitare Solitaire',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    isLocal: true,
  },
];

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
      console.warn('Error requesting storage permissions:', err);
      return false;
    }
  }

  async scanLocalMusic(): Promise<LocalTrack[]> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.log('Storage permissions denied, using default offline files.');
      return FALLBACK_LOCAL_TRACKS;
    }

    try {
      const musicDir = `${RNFS.ExternalStorageDirectoryPath}/Music`;
      const downloadDir = `${RNFS.ExternalStorageDirectoryPath}/Download`;

      const tracks: LocalTrack[] = [];

      const scanDir = async (path: string) => {
        const exists = await RNFS.exists(path);
        if (!exists) return;

        const files = await RNFS.readDir(path);
        for (const file of files) {
          if (
            file.isFile() &&
            (file.name.endsWith('.mp3') ||
              file.name.endsWith('.m4a') ||
              file.name.endsWith('.wav'))
          ) {
            tracks.push({
              id: file.path,
              title: file.name.replace(/\.[^/.]+$/, ''), // remove extension
              artist: 'Fichier Local',
              artwork:
                'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=300&fit=crop',
              url: `file://${file.path}`,
              isLocal: true,
            });
          }
        }
      };

      await scanDir(musicDir);
      await scanDir(downloadDir);

      if (tracks.length === 0) {
        return FALLBACK_LOCAL_TRACKS;
      }

      return tracks;
    } catch (error) {
      console.log('Error scanning directories, using fallback:', error);
      return FALLBACK_LOCAL_TRACKS;
    }
  }
}

export const localFileService = new LocalFileService();
