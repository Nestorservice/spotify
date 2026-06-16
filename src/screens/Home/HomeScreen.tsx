import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer from 'react-native-track-player';
import { THEME } from '../../theme';
import { musicService, TrackData } from '../../services/MusicService';
import { usePlayerStore } from '../../store/usePlayerStore';
import BackgroundMotif from '../../components/common/BackgroundMotif';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [hits, setHits] = useState<TrackData[]>([]);
  const [featured, setFeatured] = useState<TrackData | null>(null);
  
  const { setCurrentTrack, setIsPlaying } = usePlayerStore();

  useEffect(() => {
    loadLiveMusic();
  }, []);

  const loadLiveMusic = async () => {
    setLoading(true);
    const trending = await musicService.getTrendingTracks();
    setHits(trending);
    setFeatured(trending[0] || null);
    setLoading(false);
  };

  const handlePlayTrack = async (track: TrackData) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.url,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork,
      });
      await TrackPlayer.play();
      
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={THEME.colors.primaryFixedDim} />
      </View>
    );
  }

  const renderTrackCard = ({ item }: { item: TrackData }) => (
    <TouchableOpacity 
      style={styles.trackCard}
      onPress={() => handlePlayTrack(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.artwork }} style={styles.trackImage} />
        <View style={styles.playOverlay}>
          <Icon name="play-arrow" size={32} color={THEME.colors.black} />
        </View>
      </View>
      <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
    </TouchableOpacity>
  );

  const renderMixCard = ({ item }: { item: TrackData }) => (
    <TouchableOpacity style={styles.mixCard}>
      <View style={styles.mixImageContainer}>
        <Image source={{ uri: item.artwork }} style={styles.mixImage} />
      </View>
      <Text style={styles.mixTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BackgroundMotif />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.profileContainer}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM4-yMLaTqv9lrCkbyhQk0vOL-q_Kbhkh_fZHeIZoQDUTNqg-ffXeSJgWr797WDIpFhuY-3FvK0IfozpfcEVuDTTIcOv41EfUnmagapH7wHehahlk634KuR2J7hsOXVd84n3LWy6XBuuYrl6dYcPJwvg4ZoCFaq_iErgIALWswQO-c6wLIsssxiDv7QChDFMynCKXUwvZG8ixJGH3ciE_Mmo-jDfcp8gYDT0JS9WpSgni7k3MuLaiGF9kmjk7puy1DdaYgRJ_YimSU' }} 
                style={styles.profileImage} 
              />
            </View>
            <Text style={styles.brandTitle}>Sauti</Text>
          </View>
          <TouchableOpacity>
            <Icon name="settings" size={24} color={THEME.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        {featured && (
          <View style={styles.heroSection}>
            <View style={styles.heroCard}>
              <Image source={{ uri: featured.artwork }} style={styles.heroImage} />
              <View style={styles.heroOverlay}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>À L'HONNEUR</Text>
                </View>
                <Text style={styles.heroTitle}>{featured.title}</Text>
                <Text style={styles.heroSubtitle}>{featured.artist}</Text>
                <TouchableOpacity style={styles.heroPlayButton}>
                  <Icon name="play-arrow" size={24} color={THEME.colors.onPrimaryFixed} />
                  <Text style={styles.heroPlayButtonText}>ÉCOUTER MAINTENANT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Top Hits Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Top Hits du Continent</Text>
              <Text style={styles.sectionSubtitle}>LES RYTHMES QUI FONT VIBRER L'AFRIQUE</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>VOIR TOUT</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={hits}
            renderItem={renderTrackCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Découvertes Locales */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Découvertes Locales</Text>
              <Text style={styles.sectionSubtitle}>PÉPITES DE VOTRE RÉGION</Text>
            </View>
          </View>
          <FlatList
            data={locals}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.bentoCard}>
                <Image source={{ uri: item.artwork }} style={styles.bentoImage} />
                <View style={styles.bentoContent}>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NOUVEAU</Text>
                  </View>
                  <Text style={styles.bentoTitle}>{item.title}</Text>
                  <Text style={styles.bentoSubtitle}>{item.artist}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Vos Mix */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vos Mix</Text>
          </View>
          <FlatList
            data={mixes}
            renderItem={renderMixCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.marginMobile,
    marginBottom: THEME.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    ...THEME.typography.displayLg,
    fontSize: 32,
    color: THEME.colors.primaryFixedDim,
    letterSpacing: -1,
  },
  heroSection: {
    paddingHorizontal: THEME.spacing.marginMobile,
    marginBottom: THEME.spacing.lg,
  },
  heroCard: {
    width: '100%',
    aspectRatio: 4/5,
    borderRadius: THEME.rounded.lg,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: THEME.spacing.md,
  },
  featuredBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  featuredBadgeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryFixed,
  },
  heroTitle: {
    ...THEME.typography.headlineLgMobile,
    color: THEME.colors.white,
  },
  heroSubtitle: {
    ...THEME.typography.bodyMd,
    color: THEME.colors.onSurfaceVariant,
    marginBottom: 16,
  },
  heroPlayButton: {
    backgroundColor: THEME.colors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: THEME.rounded.full,
    alignSelf: 'flex-start',
    gap: 8,
  },
  heroPlayButtonText: {
    ...THEME.typography.labelLg,
    fontWeight: '700',
    color: THEME.colors.onPrimaryFixed,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: THEME.spacing.marginMobile,
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.onSurface,
  },
  sectionSubtitle: {
    ...THEME.typography.labelLg,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  seeAll: {
    ...THEME.typography.labelLg,
    color: THEME.colors.primaryFixedDim,
  },
  horizontalList: {
    paddingLeft: THEME.spacing.marginMobile,
    paddingRight: THEME.spacing.marginMobile - THEME.spacing.gutter,
  },
  trackCard: {
    width: 160,
    marginRight: THEME.spacing.gutter,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: THEME.rounded.lg,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainer,
    marginBottom: 8,
  },
  trackImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0, // Will be handled by state/interaction
  },
  trackTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
  },
  trackArtist: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  bentoCard: {
    width: 280,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 12,
    borderRadius: THEME.rounded.lg,
    marginRight: THEME.spacing.gutter,
    gap: 12,
  },
  bentoImage: {
    width: 80,
    height: 80,
    borderRadius: THEME.rounded.default,
  },
  bentoContent: {
    flex: 1,
  },
  newBadge: {
    borderWidth: 1,
    borderColor: THEME.colors.primaryFixedDim,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  newBadgeText: {
    ...THEME.typography.labelSm,
    fontSize: 8,
    color: THEME.colors.primaryFixedDim,
  },
  bentoTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
  },
  bentoSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  mixCard: {
    width: 140,
    marginRight: THEME.spacing.gutter,
    alignItems: 'center',
  },
  mixImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 70, // Full circular
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 4,
    marginBottom: 8,
  },
  mixImage: {
    width: '100%',
    height: '100%',
    borderRadius: 66,
  },
  mixTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
    textAlign: 'center',
  },
});

export default HomeScreen;
