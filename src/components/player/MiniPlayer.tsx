import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../theme';
import { usePlayerStore } from '../../store/usePlayerStore';

const { width } = Dimensions.get('window');

const MiniPlayer = () => {
  const navigation = useNavigation<any>();
  const { currentTrack, isPlaying, setIsPlaying } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Player')}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="favorite-border" size={24} color={THEME.colors.white} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Icon 
              name={isPlaying ? "pause" : "play-arrow"} 
              size={24} 
              color={THEME.colors.black} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '35%' }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // Just above the bottom tab bar
    left: THEME.spacing.marginMobile,
    right: THEME.spacing.marginMobile,
    backgroundColor: 'rgba(32, 31, 31, 0.9)',
    borderRadius: THEME.rounded.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: THEME.rounded.default,
  },
  info: {
    flex: 1,
  },
  title: {
    ...THEME.typography.labelLg,
    color: THEME.colors.white,
  },
  artist: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryFixedDim,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.colors.primaryFixed,
  },
});

export default MiniPlayer;
