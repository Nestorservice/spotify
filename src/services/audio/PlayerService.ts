// Previously react-native-track-player was set up here.
// With react-native-video, playback is handled declaratively in the component tree (see App.tsx).

export const setupPlayer = async () => {
  console.log('PlayerService: setupPlayer called (react-native-video active)');
  return true;
};

export const playbackService = async () => {
  console.log('PlayerService: playbackService called (react-native-video active)');
};
