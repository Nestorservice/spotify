import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { Share } from 'react-native';

// =========================================================================
// REPLACE THESE WITH YOUR OWN SUPABASE CREDENTIALS TO ENABLE CLOUD REALTIME SYNC
// =========================================================================
const SUPABASE_URL: string = 'https://faqgysmdcjdlnrpclfju.supabase.co';
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcWd5c21kY2pkbG5ycGNsZmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5ODc3ODksImV4cCI6MjA5NzU2Mzc4OX0.A3KKlxkp8Z_oUlYLc5l5sdzl1G9wC-ZeLxs516cfaPU';

export const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL !== 'https://your-project.supabase.co' &&
    SUPABASE_ANON_KEY !== 'your-anon-key'
  );
};

class SupabaseService {
  private supabase: any = null;
  private channel: any = null;

  constructor() {
    if (isSupabaseConfigured()) {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  }

  // Generate a random 6-character room code
  generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Create a party room and subscribe to the realtime broadcast channel
  async createRoom(
    roomName: string,
    hostUser: { id: string; name: string; avatar: string },
    onEvent: (event: string, payload: any) => void
  ): Promise<string> {
    const roomCode = this.generateRoomCode();

    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. Running in local simulation mode.');
      return roomCode;
    }

    const channelId = `party-room-${roomCode}`;
    this.channel = this.supabase.channel(channelId, {
      config: {
        broadcast: { self: false },
      },
    });

    this.channel
      .on('broadcast', { event: 'request_add_track' }, ({ payload }: any) => {
        onEvent('request_add_track', payload);
      })
      .on('broadcast', { event: 'participant_join' }, ({ payload }: any) => {
        onEvent('participant_join', payload);
      })
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully created and subscribed to party room: ${roomCode}`);
        }
      });

    return roomCode;
  }

  // Join an existing party room as a participant
  async joinRoom(
    roomCode: string,
    participantUser: { id: string; name: string; avatar: string },
    onEvent: (event: string, payload: any) => void
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. Running in local simulation mode.');
      return true;
    }

    const channelId = `party-room-${roomCode}`;
    this.channel = this.supabase.channel(channelId, {
      config: {
        broadcast: { self: false },
      },
    });

    this.channel
      .on('broadcast', { event: 'sync_state' }, ({ payload }: any) => {
        onEvent('sync_state', payload);
      })
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Joined party room: ${roomCode}`);
          // Notify the host that we joined
          this.channel.send({
            type: 'broadcast',
            event: 'participant_join',
            payload: {
              participantId: participantUser.id,
              name: participantUser.name,
              avatar: participantUser.avatar,
            },
          });
        }
      });

    return true;
  }

  // Host broadcasts current state (playback status, current track, and queue) to all participants
  broadcastState(state: {
    currentTrack: any;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    queue: any[];
  }) {
    if (!this.channel || !isSupabaseConfigured()) return;
    this.channel.send({
      type: 'broadcast',
      event: 'sync_state',
      payload: state,
    });
  }

  // Participant requests host to add a track to the queue
  requestAddTrack(track: any, senderName: string, senderAvatar: string) {
    if (!this.channel || !isSupabaseConfigured()) return;
    this.channel.send({
      type: 'broadcast',
      event: 'request_add_track',
      payload: { track, senderName, senderAvatar },
    });
  }

  // Share session link / code using native React Native Share
  async shareRoom(roomCode: string, roomName: string) {
    try {
      await Share.share({
        message: `Rejoins ma fête "${roomName}" sur Sauti ! Entre ce code de session : ${roomCode}\nLien direct: sauti://party/${roomCode}`,
        title: `Session Sauti : ${roomName}`,
      });
    } catch (error) {
      console.error('Error sharing room:', error);
    }
  }

  // Leave / Close room
  leaveRoom() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
  }
}

export const supabaseService = new SupabaseService();
