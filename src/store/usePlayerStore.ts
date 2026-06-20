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
  currentTime: number;
  duration: number;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setQueue: (queue: Track[]) => void;
  addToQueue: (track: Track) => void;
  setProgress: (currentTime: number, duration: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentTime: 0,
  duration: 0,
  setCurrentTrack: (track) => set({ currentTrack: track, currentTime: 0, duration: 0 }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setQueue: (queue) => set({ queue }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  setProgress: (currentTime, duration) => set({ currentTime, duration }),
}));
