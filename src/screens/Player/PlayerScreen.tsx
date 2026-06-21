import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Share,
  Modal,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../theme';
import { usePlayerStore } from '../../store/usePlayerStore';
import { userContentService } from '../../services/UserContentService';
import { musicService, TrackData } from '../../services/MusicService';
import BackgroundMotif from '../../components/common/BackgroundMotif';

const { width } = Dimensions.get('window');

const PlayerScreen = () => {
  const navigation = useNavigation();
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious,
    queue,
    playTrackFromQueue,
  } = usePlayerStore();

  const [isFavorite, setIsFavorite] = useState(false);
  const [queueModalVisible, setQueueModalVisible] = useState(false);
  const [lyricsVisible, setLyricsVisible] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<TrackData[]>([]);

  useEffect(() => {
    const init = async () => {
      if (currentTrack) {
        // Vérifier si le titre est dans les favoris
        try {
          const favorites = await userContentService.getFavorites();
          const isFav = favorites.some((fav: any) => fav.id === currentTrack.id);
          setIsFavorite(isFav);
        } catch (_e) {}

        // Charger les recommandations
        try {
          const recs = await musicService.getRecommendations(currentTrack as any);
          setRecommendations(recs);
        } catch (_e) {}
      }
    };
    init();
  }, [currentTrack?.id]);

  const handleFavoriteToggle = async () => {
    if (currentTrack) {
      const liked = await userContentService.toggleFavorite(currentTrack as any);
      setIsFavorite(liked);
    }
  };

  const handleShareTrack = async () => {
    if (currentTrack) {
      try {
        await Share.share({
          message: `Écoute "${currentTrack.title}" de ${currentTrack.artist} sur Sauti !`,
          title: currentTrack.title,
        });
      } catch (err) {
        console.error('Erreur lors du partage :', err);
      }
    }
  };

  const handleLoadLyrics = async () => {
    setLyricsVisible(true);
    if (currentTrack && !lyrics) {
      setLyricsLoading(true);
      try {
        const result = await musicService.getLyrics(currentTrack.artist, currentTrack.title);
        setLyrics(result);
      } catch (error) {
        console.log('Erreur de chargement des paroles :', error);
        setLyrics(null);
      } finally {
        setLyricsLoading(false);
      }
    }
  };

  // Reset lyrics when track changes
  useEffect(() => {
    setLyrics(null);
  }, [currentTrack?.id]);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <BackgroundMotif />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* En-tête */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="expand-more" size={32} color={THEME.colors.onSurface} />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <Text style={styles.nowPlayingLabel}>EN COURS DE LECTURE</Text>
              <Text style={styles.brandLabel}>Sauti Originals</Text>
            </View>
            <TouchableOpacity onPress={handleLoadLyrics}>
              <Icon name="lyrics" size={28} color={THEME.colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Pochette */}
          <View style={styles.artContainer}>
            <View style={styles.glowEffect} />
            <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
          </View>

          {/* Infos du morceau */}
          <View style={styles.infoContainer}>
            <View style={styles.titleArtist}>
              <Text style={styles.titleText}>{currentTrack.title}</Text>
              <Text style={styles.artistText}>{currentTrack.artist}</Text>
            </View>
            <TouchableOpacity onPress={handleFavoriteToggle}>
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={32}
                color={isFavorite ? THEME.colors.primaryFixedDim : THEME.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>

          {/* Barre de progression */}
          <View style={styles.progressSection}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <View style={styles.timeLabels}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Contrôles */}
          <View style={styles.controlsRow}>
            <TouchableOpacity onPress={() => toggleShuffle()}>
              <Icon
                name="shuffle"
                size={28}
                color={shuffle ? THEME.colors.primaryFixedDim : THEME.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => playPrevious()}>
              <Icon name="skip-previous" size={48} color={THEME.colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton} onPress={() => setIsPlaying(!isPlaying)}>
              <Icon
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={48}
                color={THEME.colors.onTertiaryFixed}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => playNext()}>
              <Icon name="skip-next" size={48} color={THEME.colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleRepeat()}>
              <Icon
                name={repeat === 'one' ? 'repeat-one' : 'repeat'}
                size={28}
                color={repeat !== 'off' ? THEME.colors.primaryFixedDim : THEME.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>

          {/* Pied de page */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.deviceSelector}>
              <Icon name="devices" size={20} color={THEME.colors.onSurfaceVariant} />
              <Text style={styles.deviceText}>Lecteur Sauti</Text>
            </TouchableOpacity>
            <View style={styles.footerActions}>
              <TouchableOpacity style={styles.footerIcon} onPress={handleShareTrack}>
                <Icon name="share" size={24} color={THEME.colors.onSurfaceVariant} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerIcon} onPress={() => setQueueModalVisible(true)}>
                <Icon name="playlist-play" size={28} color={THEME.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section Recommandations */}
          {recommendations.length > 0 && (
            <View style={styles.recsSection}>
              <Text style={styles.recsTitle}>Recommandé pour vous</Text>
              <Text style={styles.recsSubtitle}>Basé sur vos écoutes</Text>
              {recommendations.slice(0, 6).map((track) => (
                <TouchableOpacity
                  key={track.id}
                  style={styles.recItem}
                  onPress={() => playTrackFromQueue(track, recommendations as any)}
                >
                  <Image source={{ uri: track.artwork }} style={styles.recArtwork} />
                  <View style={styles.recInfo}>
                    <Text style={styles.recTitle} numberOfLines={1}>{track.title}</Text>
                    <Text style={styles.recArtist} numberOfLines={1}>{track.artist}</Text>
                  </View>
                  <Icon name="play-circle-outline" size={28} color={THEME.colors.primaryFixedDim} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Modal File d'attente */}
        <Modal
          visible={queueModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setQueueModalVisible(false)}
        >
          <SafeAreaView style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>File d'attente</Text>
                <TouchableOpacity onPress={() => setQueueModalVisible(false)}>
                  <Icon name="close" size={28} color={THEME.colors.onSurface} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={queue}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => {
                  const isCurrent = item.id === currentTrack.id;
                  return (
                    <TouchableOpacity
                      style={[styles.modalItem, isCurrent && styles.modalItemActive]}
                      onPress={() => {
                        playTrackFromQueue(item, queue as any);
                        setQueueModalVisible(false);
                      }}
                    >
                      <Image source={{ uri: item.artwork }} style={styles.modalArtwork} />
                      <View style={styles.modalItemInfo}>
                        <Text
                          style={[styles.modalItemTitle, isCurrent && styles.primaryText]}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text style={styles.modalItemArtist} numberOfLines={1}>
                          {item.artist}
                        </Text>
                      </View>
                      {isCurrent && (
                        <Icon name="volume-up" size={24} color={THEME.colors.primaryFixedDim} />
                      )}
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={<Text style={styles.emptyText}>La file d'attente est vide.</Text>}
              />
            </View>
          </SafeAreaView>
        </Modal>

        {/* Modal Paroles */}
        <Modal
          visible={lyricsVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setLyricsVisible(false)}
        >
          <SafeAreaView style={styles.lyricsOverlay}>
            <View style={styles.lyricsContent}>
              <View style={styles.lyricsHeader}>
                <View>
                  <Text style={styles.lyricsHeaderTitle}>Paroles</Text>
                  <Text style={styles.lyricsTrackName}>{currentTrack.title}</Text>
                </View>
                <TouchableOpacity onPress={() => setLyricsVisible(false)}>
                  <Icon name="close" size={28} color={THEME.colors.onSurface} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.lyricsScrollContainer}
              >
                {lyricsLoading ? (
                  <ActivityIndicator
                    size="large"
                    color={THEME.colors.primaryFixedDim}
                    style={{ marginTop: 60 }}
                  />
                ) : lyrics ? (
                  lyrics.split('\n').map((line, index) => (
                    <Text key={index} style={styles.lyricsLine}>
                      {line || ' '}
                    </Text>
                  ))
                ) : (
                  <View style={styles.noLyricsContainer}>
                    <Icon name="music-off" size={48} color={THEME.colors.onSurfaceVariant} />
                    <Text style={styles.noLyricsText}>
                      Paroles non disponibles pour ce titre.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
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
    color: THEME.colors.primaryFixed,
    fontWeight: 'bold',
  },
  artContainer: {
    width: width - THEME.spacing.marginMobile * 2,
    height: width - THEME.spacing.marginMobile * 2,
    marginVertical: THEME.spacing.lg,
    borderRadius: THEME.rounded.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: THEME.colors.primaryFixedDim,
    opacity: 0.15,
  },
  artwork: {
    width: '90%',
    height: '90%',
    borderRadius: THEME.rounded.lg,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  titleArtist: {
    flex: 1,
    marginRight: 16,
  },
  titleText: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.onSurface,
  },
  artistText: {
    ...THEME.typography.bodyLg,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 4,
  },
  progressSection: {
    marginBottom: THEME.spacing.lg,
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.primaryFixedDim,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
    backgroundColor: THEME.colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.colors.primaryFixed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  deviceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deviceText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerIcon: {
    padding: 4,
  },
  // Recommandations
  recsSection: {
    marginTop: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  recsTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.onSurface,
    marginBottom: 4,
  },
  recsSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginBottom: 16,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  recArtwork: {
    width: 44,
    height: 44,
    borderRadius: THEME.rounded.default,
  },
  recInfo: {
    flex: 1,
  },
  recTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
  },
  recArtist: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderTopLeftRadius: THEME.rounded.lg,
    borderTopRightRadius: THEME.rounded.lg,
    height: '60%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.onSurface,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
  },
  modalItemActive: {
    backgroundColor: 'rgba(0, 228, 118, 0.05)',
    borderRadius: THEME.rounded.default,
    paddingHorizontal: 8,
  },
  modalArtwork: {
    width: 40,
    height: 40,
    borderRadius: THEME.rounded.default,
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
  },
  primaryText: {
    color: THEME.colors.primaryFixedDim,
  },
  modalItemArtist: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  emptyText: {
    ...THEME.typography.bodyLg,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 40,
  },
  // Paroles
  lyricsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  lyricsContent: {
    flex: 1,
    padding: 20,
  },
  lyricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 16,
  },
  lyricsHeaderTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.primaryFixedDim,
  },
  lyricsTrackName: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 4,
  },
  lyricsScrollContainer: {
    paddingBottom: 40,
  },
  lyricsLine: {
    ...THEME.typography.bodyLg,
    color: THEME.colors.onSurface,
    fontSize: 20,
    lineHeight: 36,
    textAlign: 'center',
    marginVertical: 2,
  },
  noLyricsContainer: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 16,
  },
  noLyricsText: {
    ...THEME.typography.bodyLg,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});

export default PlayerScreen;
