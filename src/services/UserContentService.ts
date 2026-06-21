import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TrackData } from './MusicService';

// Fallback in-memory list for favorites if Firebase fails/offline
let localFavorites: TrackData[] = [];

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
        return false; // Retiré des favoris
      } else {
        await favRef.set({
          ...track,
          addedAt: firestore.FieldValue.serverTimestamp(),
        });
        if (!localFavorites.some(f => f.id === track.id)) {
          localFavorites.push(track);
        }
        return true; // Ajouté aux favoris
      }
    } catch (error) {
      console.log('Firebase offline/not configured, using local fallback:', error);
      const existsIndex = localFavorites.findIndex(f => f.id === track.id);
      if (existsIndex > -1) {
        localFavorites.splice(existsIndex, 1);
        return false;
      } else {
        localFavorites.push(track);
        return true;
      }
    }
  }

  async getFavorites(): Promise<TrackData[]> {
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
