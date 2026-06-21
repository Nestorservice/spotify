import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../theme';
import { usePlayerStore } from '../../store/usePlayerStore';
import { userContentService } from '../../services/UserContentService';

const MiniPlayer = () => {
  const navigation = useNavigation<any>();
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
  } = usePlayerStore();

  const [isFavorite, setIsFavorite] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const translateY = useRef(new Animated.Value(0)).current;

  // Reset dismissed state when a new track starts
  useEffect(() => {
    if (currentTrack) {
      setDismissed(false);
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
    }
  }, [currentTrack?.id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (currentTrack) {
        try {
          const favorites = await userContentService.getFavorites();
          const isFav = favorites.some((fav: any) => fav.id === currentTrack.id);
          setIsFavorite(isFav);
        } catch (_e) {
          // silent
        }
      }
    };
    checkFavorite();
  }, [currentTrack]);

  if (!currentTrack || dismissed) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleFavoriteToggle = async () => {
    if (currentTrack) {
      const liked = await userContentService.toggleFavorite(currentTrack as any);
      setIsFavorite(liked);
    }
  };

  const handleTouchStart = (e: any) => {
    touchStartRef.current = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    };
  };

  const handleTouchEnd = (e: any) => {
    const diffX = e.nativeEvent.pageX - touchStartRef.current.x;
    const diffY = e.nativeEvent.pageY - touchStartRef.current.y;

    // Swipe down to dismiss mini player (just hide it, don't nullify currentTrack)
    if (diffY > 60 || Math.abs(diffX) > 100) {
      setIsPlaying(false);
      Animated.timing(translateY, {
        toValue: 200,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setDismissed(true));
    }
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }]}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Player')}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton} onPress={handleFavoriteToggle}>
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isFavorite ? THEME.colors.primaryFixedDim : THEME.colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton} onPress={() => setIsPlaying(!isPlaying)}>
              <Icon
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={24}
                color={THEME.colors.black}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Barre de progression */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    left: THEME.spacing.marginMobile,
    right: THEME.spacing.marginMobile,
    backgroundColor: 'rgba(32, 31, 31, 0.95)',
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
