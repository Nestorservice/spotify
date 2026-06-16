import { create } from 'zustand';
import { PartySession, NearbyParticipant } from '../services/connectivity/NearbyService';
import { TrackData } from '../services/firebase/MusicService';

interface PartyState {
  currentSession: PartySession | null;
  collaborativeQueue: { track: TrackData; addedBy: NearbyParticipant }[];
  isSearching: boolean;
  discoveredSessions: PartySession[];
  
  setSession: (session: PartySession | null) => void;
  setDiscoveredSessions: (sessions: PartySession[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  addToCollaborativeQueue: (track: TrackData, participant: NearbyParticipant) => void;
}

export const usePartyStore = create<PartyState>((set) => ({
  currentSession: null,
  collaborativeQueue: [],
  isSearching: false,
  discoveredSessions: [],

  setSession: (session) => set({ currentSession: session }),
  setDiscoveredSessions: (sessions) => set({ discoveredSessions: sessions }),
  setIsSearching: (isSearching) => set({ isSearching }),
  addToCollaborativeQueue: (track, participant) => 
    set((state) => ({ 
      collaborativeQueue: [...state.collaborativeQueue, { track, addedBy: participant }] 
    })),
}));
