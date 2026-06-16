import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export interface TrackData {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  url: string;
  genre: string;
  featured?: boolean;
  type?: 'hit' | 'local' | 'mix';
}

class MusicService {
  async getFeaturedTrack(): Promise<TrackData | null> {
    const snapshot = await firestore()
      .collection('tracks')
      .where('featured', '==', true)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as TrackData;
  }

  async getTracksByType(type: 'hit' | 'local' | 'mix'): Promise<TrackData[]> {
    const snapshot = await firestore()
      .collection('tracks')
      .where('type', '==', type)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrackData));
  }

  async getAudioUrl(path: string): Promise<string> {
    return await storage().ref(path).getDownloadURL();
  }
}

export const musicService = new MusicService();
