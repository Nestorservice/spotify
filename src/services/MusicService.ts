export interface TrackData {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  url: string;
  genre?: string;
  preview: string;
  duration?: number;
}

export interface ArtistData {
  id: string;
  name: string;
  picture: string;
  fans?: number;
}

export interface PlaylistData {
  id: string;
  title: string;
  picture: string;
  trackCount: number;
  creator?: string;
}

class MusicService {
  private BASE_URL = 'https://api.deezer.com';

  async getTrendingTracks(): Promise<TrackData[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/chart/0/tracks?limit=25`);
      const data = await response.json();

      return (data.data || []).map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        artwork: track.album.cover_big || track.album.cover_medium,
        url: track.preview,
        preview: track.preview,
        duration: track.duration,
      }));
    } catch (error) {
      console.error('Error fetching trending:', error);
      return [];
    }
  }

  async searchTracks(query: string): Promise<TrackData[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/search?q=${encodeURIComponent(query)}&limit=20`,
      );
      const data = await response.json();

      return (data.data || []).map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        artwork: track.album.cover_big || track.album.cover_medium,
        url: track.preview,
        preview: track.preview,
        duration: track.duration,
      }));
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  async getTracksByGenre(genreId: number): Promise<TrackData[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/chart/${genreId}/tracks?limit=20`,
      );
      const data = await response.json();

      return (data.data || []).map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        artwork: track.album.cover_big || track.album.cover_medium,
        url: track.preview,
        preview: track.preview,
        duration: track.duration,
      }));
    } catch (error) {
      console.error('Error fetching genre tracks:', error);
      return [];
    }
  }

  async getTopArtists(): Promise<ArtistData[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/chart/0/artists?limit=10`);
      const data = await response.json();

      return (data.data || []).map((artist: any) => ({
        id: artist.id.toString(),
        name: artist.name,
        picture: artist.picture_big || artist.picture_medium,
        fans: artist.nb_fan,
      }));
    } catch (error) {
      console.error('Error fetching top artists:', error);
      return [];
    }
  }

  async getTopPlaylists(): Promise<PlaylistData[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/chart/0/playlists?limit=10`,
      );
      const data = await response.json();

      return (data.data || []).map((pl: any) => ({
        id: pl.id.toString(),
        title: pl.title,
        picture: pl.picture_big || pl.picture_medium,
        trackCount: pl.nb_tracks,
        creator: pl.user?.name,
      }));
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  }

  async getPlaylistTracks(playlistId: string): Promise<TrackData[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/playlist/${playlistId}/tracks?limit=30`,
      );
      const data = await response.json();

      return (data.data || []).map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        artwork: track.album.cover_big || track.album.cover_medium,
        url: track.preview,
        preview: track.preview,
        duration: track.duration,
      }));
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      return [];
    }
  }

  async getArtistTracks(artistId: string): Promise<TrackData[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/artist/${artistId}/top?limit=15`,
      );
      const data = await response.json();

      return (data.data || []).map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        artwork: track.album.cover_big || track.album.cover_medium,
        url: track.preview,
        preview: track.preview,
        duration: track.duration,
      }));
    } catch (error) {
      console.error('Error fetching artist tracks:', error);
      return [];
    }
  }

  // Deezer genre IDs for African genres
  static GENRE_IDS: Record<string, number> = {
    Afrobeats: 0, // use global chart as fallback
    Amapiano: 0,
    Makossa: 0,
    Bikutsi: 0,
    Highlife: 0,
    'Ethio-Jazz': 0,
    Rap: 116,
    Pop: 132,
    Rock: 152,
    'R&B': 165,
    Reggae: 144,
    Jazz: 129,
  };
}

export const musicService = new MusicService();
