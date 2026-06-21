import {create} from 'zustand';

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
  currentIndex: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setQueue: (queue: Track[]) => void;
  addToQueue: (track: Track) => void;
  playTrackFromQueue: (track: Track, queue: Track[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setProgress: (currentTime: number, duration: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  currentTime: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',

  setCurrentTrack: track =>
    set({currentTrack: track, currentTime: 0, duration: 0}),

  setIsPlaying: isPlaying => set({isPlaying}),

  setQueue: queue => set({queue}),

  addToQueue: track =>
    set(state => ({queue: [...state.queue, track]})),

  playTrackFromQueue: (track, queue) => {
    const index = queue.findIndex(t => t.id === track.id);
    set({
      currentTrack: track,
      queue,
      currentIndex: index >= 0 ? index : 0,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    });
  },

  playNext: () => {
    const {queue, currentIndex, shuffle, repeat} = get();
    if (queue.length === 0) return;

    let nextIndex: number;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeat === 'all') {
          nextIndex = 0;
        } else {
          set({isPlaying: false});
          return;
        }
      }
    }

    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      set({
        currentTrack: nextTrack,
        currentIndex: nextIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      });
    }
  },

  playPrevious: () => {
    const {queue, currentIndex, currentTime} = get();
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart current track
    if (currentTime > 3) {
      set({currentTime: 0});
      return;
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      set({
        currentTrack: prevTrack,
        currentIndex: prevIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      });
    }
  },

  toggleShuffle: () => set(state => ({shuffle: !state.shuffle})),

  toggleRepeat: () =>
    set(state => {
      const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
      const currentIdx = modes.indexOf(state.repeat);
      return {repeat: modes[(currentIdx + 1) % modes.length]};
    }),

  setProgress: (currentTime, duration) => set({currentTime, duration}),
}));
