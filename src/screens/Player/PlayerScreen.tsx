import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../theme';
import { usePlayerStore } from '../../store/usePlayerStore';
import { userContentService } from '../../services/UserContentService';
import BackgroundMotif from '../../components/common/BackgroundMotif';

const { width } = Dimensions.get('window');

const PlayerScreen = () => {
  const navigation = useNavigation();
  const { currentTrack, isPlaying, setIsPlaying } = usePlayerStore();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = async () => {
    if (currentTrack) {
      const liked = await userContentService.toggleFavorite(currentTrack);
      setIsFavorite(liked);
    }
  };

  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      <BackgroundMotif />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="expand-more" size={32} color={THEME.colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>
            <Text style={styles.brandLabel}>Sauti Originals</Text>
          </View>
          <TouchableOpacity>
            <Icon name="more-vert" size={28} color={THEME.colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Album Art */}
        <View style={styles.artContainer}>
          <View style={styles.glowEffect} />
          <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
        </View>

        {/* Song Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleArtist}>
            <Text style={styles.titleText}>{currentTrack.title}</Text>
            <Text style={styles.artistText}>{currentTrack.artist}</Text>
          </View>
          <TouchableOpacity onPress={handleFavoriteToggle}>
            <Icon 
              name={isFavorite ? "favorite" : "favorite-border"} 
              size={32} 
              color={isFavorite ? THEME.colors.primaryFixedDim : THEME.colors.onSurfaceVariant} 
            />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>1:24</Text>
            <Text style={styles.timeText}>4:15</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity>
            <Icon name="shuffle" size={28} color={THEME.colors.onSurfaceVariant} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="skip-previous" size={48} color={THEME.colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Icon 
              name={isPlaying ? "pause" : "play-arrow"} 
              size={48} 
              color={THEME.colors.onTertiaryFixed} 
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="skip-next" size={48} color={THEME.colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="repeat" size={28} color={THEME.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.deviceSelector}>
            <Icon name="devices" size={20} color={THEME.colors.onSurfaceVariant} />
            <Text style={styles.deviceText}>AirPods Pro</Text>
          </TouchableOpacity>
          <View style={styles.footerActions}>
            <TouchableOpacity style={styles.footerIcon}>
              <Icon name="share" size={24} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerIcon}>
              <Icon name="playlist-play" size={28} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: THEME.spacing.marginMobile,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
  },
  headerTitle: {
    alignItems: 'center',
  },
  nowPlayingLabel: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    letterSpacing: 2,
  },
  brandLabel: {
    ...THEME.typography.labelLg,
    color: THEME.colors.primaryFixedDim,
  },
  artContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
  },
  artwork: {
    width: width - (THEME.spacing.marginMobile * 2),
    aspectRatio: 1,
    borderRadius: THEME.rounded.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glowEffect: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: THEME.colors.primaryFixedDim,
    opacity: 0.15,
    transform: [{ scale: 1.5 }],
    blurRadius: 100, // Not directly supported in RN View, but we can simulate with transparent circles or libraries
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  titleArtist: {
    flex: 1,
    gap: 4,
  },
  titleText: {
    ...THEME.typography.headlineLgMobile,
    color: THEME.colors.white,
  },
  artistText: {
    ...THEME.typography.bodyLg,
    color: THEME.colors.onSurfaceVariant,
  },
  progressSection: {
    marginBottom: THEME.spacing.lg,
  },
  progressBackground: {
    height: 4,
    backgroundColor: THEME.colors.surfaceContainerHighest,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.primaryFixedDim,
    borderRadius: 2,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.colors.tertiaryFixedDim,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: THEME.colors.tertiaryFixedDim,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: THEME.spacing.xl,
  },
  deviceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deviceText: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurfaceVariant,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  footerIcon: {
    padding: 4,
  },
});

export default PlayerScreen;
