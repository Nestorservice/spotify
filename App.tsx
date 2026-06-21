/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import RootNavigator from './src/navigation';
import { setupPlayer } from './src/services/audio/PlayerService';
import { usePlayerStore } from './src/store/usePlayerStore';

function App(): React.JSX.Element {
  const { currentTrack, isPlaying, setCurrentTrack, setProgress, setIsPlaying } = usePlayerStore();

  useEffect(() => {
    const init = async () => {
      await setupPlayer();
      
      // Set a default track for the demonstration as per design
      setCurrentTrack({
        id: '1',
        title: 'Logdrum Ritual',
        artist: 'Musa Keys',
        artwork: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZl6tR1L5AHtSqH3ReIfSikWmS1iIEwWH5IZUIZC8O76bqMctYRlctUPSrWG04PZLwz79NWvnCMAfHsrlZNRLZoEryytrs-ExN8uAmhENBCxD-g6duDS_sgFOGAjleTswTZQfxFs7CqVvR0ddN5g0QQ-kUMgqAXFlkcIKnHa84FscN6LZC0sQ6IekO8DMaGTkCNOVUgSdV_DZPstRdv2Z5gGFBmpFMMiFZuI_i5xha3qoQUnuS7O_idv8KPQ4TCU1ZYkp9rzP56wyi',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Playable demo stream
      });
    };

    init();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <RootNavigator />
      {currentTrack && currentTrack.url ? (
        <Video
          source={{ uri: currentTrack.url }}
          paused={!isPlaying}
          playInBackground={true}
          ignoreSilentSwitch="ignore"
          onLoad={(data: any) => {
            setProgress(0, data.duration);
          }}
          onProgress={(data: any) => {
            setProgress(data.currentTime, data.seekableDuration || data.playableDuration || usePlayerStore.getState().duration || 1);
          }}
          onEnd={() => {
            usePlayerStore.getState().onTrackEnd();
          }}
          onError={(err: any) => {
            console.log('Audio playback error:', err);
          }}
          style={{ width: 0, height: 0, position: 'absolute' }}
        />
      ) : null}
    </SafeAreaProvider>
  );
}

export default App;
