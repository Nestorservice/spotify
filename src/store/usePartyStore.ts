import { create } from 'zustand';
import { TrackData } from '../services/MusicService';
import { supabaseService, isSupabaseConfigured } from '../services/connectivity/SupabaseService';
import { usePlayerStore } from './usePlayerStore';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isActive?: boolean;
}

export interface PartySession {
  code: string;
  name: string;
  role: 'host' | 'guest' | null;
  participants: Participant[];
}

interface PartyState {
  currentSession: PartySession | null;
  isSearching: boolean;
  supabaseConnected: boolean;

  createSession: (roomName: string, hostName: string, hostAvatar: string) => Promise<string>;
  joinSession: (roomCode: string, userName: string, userAvatar: string) => Promise<boolean>;
  leaveSession: () => void;
  addParticipant: (participant: Participant) => void;
  shareSession: () => void;
  requestAddTrack: (track: TrackData, userName: string, userAvatar: string) => void;
}

// Generate unique ID for participants
const generateId = () => Math.random().toString(36).substring(2, 11);

export const usePartyStore = create<PartyState>((set, get) => ({
  currentSession: null,
  isSearching: false,
  supabaseConnected: isSupabaseConfigured(),

  createSession: async (roomName, hostName, hostAvatar) => {
    set({ isSearching: true });
    const hostUser = { id: generateId(), name: hostName, avatar: hostAvatar };

    const roomCode = await supabaseService.createRoom(
      roomName,
      hostUser,
      (event, payload) => {
        const current = get().currentSession;
        if (!current) return;

        if (event === 'participant_join') {
          // Add new participant
          const newParticipant: Participant = {
            id: payload.participantId,
            name: payload.name,
            avatar: payload.avatar,
            isActive: true,
          };
          get().addParticipant(newParticipant);

          // Host instantly sends initial state to sync new participant
          const playerState = usePlayerStore.getState();
          supabaseService.broadcastState({
            currentTrack: playerState.currentTrack,
            isPlaying: playerState.isPlaying,
            currentTime: playerState.currentTime,
            duration: playerState.duration,
            queue: playerState.queue,
          });
        } else if (event === 'request_add_track') {
          // Add track requested by guest to host queue
          const playerStore = usePlayerStore.getState();
          playerStore.addToQueue(payload.track);
        }
      }
    );

    const session: PartySession = {
      code: roomCode,
      name: roomName,
      role: 'host',
      participants: [{ ...hostUser, isHost: true, isActive: true }],
    };

    set({ currentSession: session, isSearching: false });
    return roomCode;
  },

  joinSession: async (roomCode, userName, userAvatar) => {
    set({ isSearching: true });
    const guestUser = { id: generateId(), name: userName, avatar: userAvatar };

    const success = await supabaseService.joinRoom(
      roomCode,
      guestUser,
      (event, payload) => {
        if (event === 'sync_state') {
          const playerStore = usePlayerStore.getState();

          // Sync active track
          if (JSON.stringify(playerStore.currentTrack) !== JSON.stringify(payload.currentTrack)) {
            playerStore.setCurrentTrack(payload.currentTrack);
          }
          // Sync play state
          if (playerStore.isPlaying !== payload.isPlaying) {
            playerStore.setIsPlaying(payload.isPlaying);
          }
          // Sync queue
          if (JSON.stringify(playerStore.queue) !== JSON.stringify(payload.queue)) {
            playerStore.setQueue(payload.queue);
          }
        }
      }
    );

    if (success) {
      const session: PartySession = {
        code: roomCode,
        name: `Salon ${roomCode}`,
        role: 'guest',
        participants: [
          { id: 'host-placeholder', name: 'Hôte', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', isHost: true, isActive: true },
          { ...guestUser, isActive: true }
        ],
      };
      set({ currentSession: session, isSearching: false });
      return true;
    }

    set({ isSearching: false });
    return false;
  },

  leaveSession: () => {
    supabaseService.leaveRoom();
    set({ currentSession: null });
  },

  addParticipant: (participant) => {
    set((state) => {
      if (!state.currentSession) return {};
      // Avoid duplicate adds
      if (state.currentSession.participants.some((p) => p.id === participant.id)) {
        return {};
      }
      return {
        currentSession: {
          ...state.currentSession,
          participants: [...state.currentSession.participants, participant],
        },
      };
    });
  },

  shareSession: () => {
    const session = get().currentSession;
    if (session) {
      supabaseService.shareRoom(session.code, session.name);
    }
  },

  requestAddTrack: (track, userName, userAvatar) => {
    const session = get().currentSession;
    if (session && session.role === 'guest') {
      supabaseService.requestAddTrack(track, userName, userAvatar);
    }
  },
}));

// Subscribe to player state changes to broadcast when acting as host
usePlayerStore.subscribe((state) => {
  const partyState = usePartyStore.getState();
  if (partyState.currentSession?.role === 'host') {
    supabaseService.broadcastState({
      currentTrack: state.currentTrack,
      isPlaying: state.isPlaying,
      currentTime: state.currentTime,
      duration: state.duration,
      queue: state.queue,
    });
  }
});
