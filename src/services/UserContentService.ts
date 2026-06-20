import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TrackData } from './MusicService';

class UserContentService {
  private getUserId() {
    return auth().currentUser?.uid || 'guest_user';
  }

  // --- FAVORIS ---
  async toggleFavorite(track: TrackData): Promise<boolean> {
    const userId = this.getUserId();
    const favRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('favorites')
      .doc(track.id);

    const doc = await favRef.get();
    const docExists = typeof doc.exists === 'function' ? (doc.exists as any)() : doc.exists;
    if (docExists) {
      await favRef.delete();
      return false; // Retiré des favoris
    } else {
      await favRef.set({
        ...track,
        addedAt: firestore.FieldValue.serverTimestamp(),
      });
      return true; // Ajouté aux favoris
    }
  }

  async getFavorites(): Promise<TrackData[]> {
    const userId = this.getUserId();
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('favorites')
      .orderBy('addedAt', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data() as TrackData);
  }

  // --- PLAYLISTS ---
  async createPlaylist(name: string) {
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
  }

  async addTrackToPlaylist(playlistId: string, track: TrackData) {
    const userId = this.getUserId();
    return await firestore()
      .collection('users')
      .doc(userId)
      .collection('playlists')
      .doc(playlistId)
      .update({
        tracks: firestore.FieldValue.arrayUnion(track),
      });
  }
}

export const userContentService = new UserContentService();
