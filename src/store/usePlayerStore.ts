import { create } from 'zustand';

interface Track {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
  duration?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setQueue: (queue: Track[]) => void;
  addToQueue: (track: Track) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setQueue: (queue) => set({ queue }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
}));
