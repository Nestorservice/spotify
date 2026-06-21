import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import { TrackData } from './MusicService';

const LOCAL_FAVS_PATH = `${RNFS.DocumentDirectoryPath}/favorites.json`;

// Fallback in-memory list for favorites if Firebase fails/offline
let localFavorites: TrackData[] = [];
let localFavoritesLoaded = false;

async function loadLocalFavoritesIfNeeded() {
  if (localFavoritesLoaded) return;
  try {
    const exists = await RNFS.exists(LOCAL_FAVS_PATH);
    if (exists) {
      const content = await RNFS.readFile(LOCAL_FAVS_PATH, 'utf8');
      localFavorites = JSON.parse(content) || [];
    }
  } catch (e) {
    console.log('Error reading local favorites file:', e);
  }
  localFavoritesLoaded = true;
}

async function saveLocalFavorites(favs: TrackData[]) {
  try {
    await RNFS.writeFile(LOCAL_FAVS_PATH, JSON.stringify(favs), 'utf8');
  } catch (e) {
    console.log('Error writing local favorites file:', e);
  }
}

class UserContentService {
  private getUserId() {
    try {
      return auth().currentUser?.uid || 'guest_user';
    } catch {
      return 'guest_user';
    }
  }

  // --- FAVORIS ---
  async toggleFavorite(track: TrackData): Promise<boolean> {
    await loadLocalFavoritesIfNeeded();
    try {
      const userId = this.getUserId();
      const favRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('favorites')
        .doc(track.id);

      const doc = await favRef.get();
      const docExists =
        typeof doc.exists === 'function' ? (doc.exists as any)() : doc.exists;

      if (docExists) {
        await favRef.delete();
        localFavorites = localFavorites.filter(f => f.id !== track.id);
        await saveLocalFavorites(localFavorites);
        return false; // Retiré des favoris
      } else {
        await favRef.set({
          ...track,
          addedAt: firestore.FieldValue.serverTimestamp(),
        });
        if (!localFavorites.some(f => f.id === track.id)) {
          localFavorites.push(track);
        }
        await saveLocalFavorites(localFavorites);
        return true; // Ajouté aux favoris
      }
    } catch (error) {
      console.log('Firebase offline/not configured, using local fallback:', error);
      const existsIndex = localFavorites.findIndex(f => f.id === track.id);
      let added = false;
      if (existsIndex > -1) {
        localFavorites.splice(existsIndex, 1);
        added = false;
      } else {
        localFavorites.push(track);
        added = true;
      }
      await saveLocalFavorites(localFavorites);
      return added;
    }
  }

  async getFavorites(): Promise<TrackData[]> {
    await loadLocalFavoritesIfNeeded();
    try {
      const userId = this.getUserId();
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('favorites')
        .orderBy('addedAt', 'desc')
        .get();

      const list = snapshot.docs.map(doc => doc.data() as TrackData);
      localFavorites = list;
      await saveLocalFavorites(localFavorites);
      return list;
    } catch (error) {
      console.log('Firebase offline/not configured, using local fallback:', error);
      return localFavorites;
    }
  }

  // --- PLAYLISTS ---
  async createPlaylist(name: string) {
    try {
      const userId = this.getUserId();
      return await firestore()
        .collection('users')
        .doc(userId)
        .collection('playlists')
        .add({
          name,
          tracks: [],
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.log('Firebase error in createPlaylist:', error);
      return { id: Math.random().toString() };
    }
  }

  async addTrackToPlaylist(playlistId: string, track: TrackData) {
    try {
      const userId = this.getUserId();
      return await firestore()
        .collection('users')
        .doc(userId)
        .collection('playlists')
        .doc(playlistId)
        .update({
          tracks: firestore.FieldValue.arrayUnion(track),
        });
    } catch (error) {
      console.log('Firebase error in addTrackToPlaylist:', error);
    }
  }
}

export const userContentService = new UserContentService();
