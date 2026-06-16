export interface TrackData {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  url: string;
  genre?: string;
  preview: string;
}

class MusicService {
  private BASE_URL = 'https://api.deezer.com';

  async getTrendingTracks(): Promise<TrackData[]> {
    try {
      // On récupère le top chart (très riche en Afrobeats actuellement)
      const response = await fetch(`${this.BASE_URL}/chart/0/tracks`);
      const data = await response.json();
      
      return data.data.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        artwork: track.album.cover_big,
        url: track.preview, // Utilisation du flux de streaming Deezer
        preview: track.preview,
      }));
    } catch (error) {
      console.error('Error fetching trending:', error);
      return [];
    }
  }

  async searchTracks(query: string): Promise<TrackData[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      return data.data.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        artwork: track.album.cover_big,
        url: track.preview,
        preview: track.preview,
      }));
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  async getTracksByArtist(artistName: string): Promise<TrackData[]> {
    return this.searchTracks(artistName);
  }
}

export const musicService = new MusicService();
