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

// Global flag to prevent update loops between devices
let isSyncingFromRemote = false;

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
          // Add participant to the list
          const newParticipant: Participant = {
            id: payload.participantId,
            name: payload.name,
            avatar: payload.avatar,
            isActive: true,
          };
          get().addParticipant(newParticipant);

          // Host syncs state to new participant
          const playerState = usePlayerStore.getState();
          supabaseService.broadcastState({
            currentTrack: playerState.currentTrack,
            isPlaying: playerState.isPlaying,
            currentTime: playerState.currentTime,
            duration: playerState.duration,
            queue: playerState.queue,
          });
        } else if (event === 'request_add_track') {
          // Add track to queue
          isSyncingFromRemote = true;
          const playerStore = usePlayerStore.getState();
          playerStore.addToQueue(payload.track);
          isSyncingFromRemote = false;

          // Broadcast updated state to all members
          supabaseService.broadcastState({
            currentTrack: playerStore.currentTrack,
            isPlaying: playerStore.isPlaying,
            currentTime: playerStore.currentTime,
            duration: playerStore.duration,
            queue: playerStore.queue,
          });
        } else if (event === 'sync_state') {
          // Symmetric support: Sync guest playback updates on host side
          isSyncingFromRemote = true;
          const playerStore = usePlayerStore.getState();
          try {
            if (JSON.stringify(playerStore.currentTrack) !== JSON.stringify(payload.currentTrack)) {
              playerStore.setCurrentTrack(payload.currentTrack);
            }
            if (playerStore.isPlaying !== payload.isPlaying) {
              playerStore.setIsPlaying(payload.isPlaying);
            }
            if (JSON.stringify(playerStore.queue) !== JSON.stringify(payload.queue)) {
              playerStore.setQueue(payload.queue);
            }
          } finally {
            // Delay disabling to ensure Zustand batch updates finish
            setTimeout(() => {
              isSyncingFromRemote = false;
            }, 100);
          }
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
          isSyncingFromRemote = true;
          const playerStore = usePlayerStore.getState();
          try {
            if (JSON.stringify(playerStore.currentTrack) !== JSON.stringify(payload.currentTrack)) {
              playerStore.setCurrentTrack(payload.currentTrack);
            }
            if (playerStore.isPlaying !== payload.isPlaying) {
              playerStore.setIsPlaying(payload.isPlaying);
            }
            if (JSON.stringify(playerStore.queue) !== JSON.stringify(payload.queue)) {
              playerStore.setQueue(payload.queue);
            }
          } finally {
            setTimeout(() => {
              isSyncingFromRemote = false;
            }, 100);
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
          {
            id: 'host-placeholder',
            name: 'Hôte',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
            isHost: true,
            isActive: true,
          },
          { ...guestUser, isActive: true },
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
    if (session) {
      if (session.role === 'guest') {
        supabaseService.requestAddTrack(track, userName, userAvatar);
      } else {
        usePlayerStore.getState().addToQueue(track);
      }
    }
  },
}));

// Subscribe to player state changes to broadcast to everyone in the party room
usePlayerStore.subscribe((state) => {
  const partyState = usePartyStore.getState();
  if (partyState.currentSession && !isSyncingFromRemote) {
    supabaseService.broadcastState({
      currentTrack: state.currentTrack,
      isPlaying: state.isPlaying,
      currentTime: state.currentTime,
      duration: state.duration,
      queue: state.queue,
    });
  }
});
