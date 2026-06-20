import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { THEME } from '../../theme';
import { musicService, TrackData } from '../../services/MusicService';
import { usePlayerStore } from '../../store/usePlayerStore';
import BackgroundMotif from '../../components/common/BackgroundMotif';

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(false);
  const { setCurrentTrack, setIsPlaying } = usePlayerStore();

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setLoading(true);
      const searchResults = await musicService.searchTracks(text);
      setResults(searchResults);
      setLoading(false);
    } else {
      setResults([]);
    }
  };

  const handlePlayTrack = (track: TrackData) => {
    try {
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const renderSearchResult = ({ item }: { item: TrackData }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => handlePlayTrack(item)}
    >
      <Image source={{ uri: item.artwork }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.resultArtist} numberOfLines={1}>{item.artist}</Text>
      </View>
      <Icon name="play-circle-outline" size={24} color={THEME.colors.primaryFixedDim} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BackgroundMotif />
      
      <SafeAreaView style={styles.safeArea}>
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

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Icon name="search" size={24} color={THEME.colors.onSurfaceVariant} />
              <TextInput
                style={styles.searchInput}
                placeholder="Artistes, titres ou genres..."
                placeholderTextColor={THEME.colors.onSurfaceVariant}
                value={query}
                onChangeText={handleSearch}
              />
            </View>
          </View>

          {/* Search Results */}
          {loading ? (
            <ActivityIndicator size="large" color={THEME.colors.primaryFixedDim} style={{ marginVertical: 20 }} />
          ) : results.length > 0 ? (
            <View style={styles.resultsContainer}>
              <FlatList
                data={results}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.resultsList}
              />
            </View>
          ) : null}

          {/* Daily Discovery */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Discovery</Text>
            <TouchableOpacity style={styles.heroCard}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJiooX-ureSuIRyq8Pt0JPzZq9LAnvwLhaeQex-iafmW59JjEkJepZ0rcJmXnhFUlVLmQBqruBHirWeRUBo_e5HT1AmYcpoc_Oiu0fDsW8SReCRJTuRsd7hRM8C7Y0Zt3yH-acCd2xJaKw32zM-NNMZ_oaAsUpsGKNaQN3FGMCbWCy18yFwB01rmO2NXO3m_T1GevdlRurS1UBlToNACfYRy84tpqRp2LMPiqrx4yVgtIGkIAgqqXjRVmOLsphJjfKE6IShBvTtUmO' }} 
                style={styles.heroImage} 
              />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroBadge}>EDITORS' PICK</Text>
                <Text style={styles.heroTitle}>Lagos Night Rhythms</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Explore Genres */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explore Genres</Text>
            <View style={styles.genreGrid}>
              <GenreCard title="Afrobeats" color="#00ff85" icon="radio" />
              <GenreCard title="Amapiano" color="#ffb4a4" icon="piano" />
              <GenreCard title="Makossa" color="#f7be1d" icon="waves" />
              <GenreCard title="Bikutsi" color="#e5e2e1" icon="auto_graph" />
              <GenreCard title="Highlife" color="#00e476" icon="equalizer" />
              <GenreCard title="Ethio-Jazz" color="#ffb9aa" icon="nightlife" />
            </View>
          </View>

          {/* Moods & Moments */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Moods & Moments</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodsRow}>
              <MoodCard title="Morning" icon="flare" color={THEME.colors.primaryFixedDim} />
              <MoodCard title="Workout" icon="fitness-center" color={THEME.colors.secondary} />
              <MoodCard title="Focus" icon="self-improvement" color={THEME.colors.tertiaryFixedDim} />
              <MoodCard title="Party" icon="celebration" color={THEME.colors.primaryFixed} />
            </ScrollView>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const GenreCard = ({ title, color, icon }: any) => (
  <TouchableOpacity style={[styles.genreCard, { backgroundColor: `${color}10` }]}>
    <Text style={[styles.genreTitle, { color }]}>{title}</Text>
    <Icon name={icon} size={24} color={color} style={styles.genreIcon} />
  </TouchableOpacity>
);

const MoodCard = ({ title, icon, color }: any) => (
  <TouchableOpacity style={styles.moodCard}>
    <View style={styles.moodCircle}>
      <Icon name={icon} size={32} color={color} />
    </View>
    <Text style={styles.moodTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.marginMobile,
    paddingVertical: THEME.spacing.md,
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
  scrollContent: {
    paddingTop: THEME.spacing.sm,
  },
  searchSection: {
    paddingHorizontal: THEME.spacing.marginMobile,
    marginBottom: THEME.spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingHorizontal: 16,
    borderRadius: THEME.rounded.lg,
    gap: 12,
    height: 56,
  },
  searchInput: {
    flex: 1,
    ...THEME.typography.bodyLg,
    color: THEME.colors.onSurface,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    ...THEME.typography.headlineLgMobile,
    color: THEME.colors.onSurface,
    paddingHorizontal: THEME.spacing.marginMobile,
    marginBottom: THEME.spacing.md,
  },
  heroCard: {
    marginHorizontal: THEME.spacing.marginMobile,
    height: 192,
    borderRadius: THEME.rounded.lg,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroBadge: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryFixed,
    marginBottom: 4,
  },
  heroTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.white,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: THEME.spacing.marginMobile,
    gap: 12,
  },
  genreCard: {
    width: (width - (THEME.spacing.marginMobile * 2) - 12) / 2,
    height: 120,
    borderRadius: THEME.rounded.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  genreTitle: {
    ...THEME.typography.headlineMd,
    fontSize: 18,
  },
  genreIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    opacity: 0.5,
  },
  moodsRow: {
    paddingLeft: THEME.spacing.marginMobile,
  },
  moodCard: {
    alignItems: 'center',
    marginRight: 24,
  },
  moodCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceContainerLow,
    marginBottom: 8,
  },
  moodTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
  },
  resultsContainer: {
    marginBottom: THEME.spacing.lg,
  },
  resultsList: {
    paddingHorizontal: THEME.spacing.marginMobile,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 16,
  },
  resultImage: {
    width: 56,
    height: 56,
    borderRadius: THEME.rounded.default,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    ...THEME.typography.bodyLg,
    fontWeight: '600',
    color: THEME.colors.onSurface,
  },
  resultArtist: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 4,
  },
});

export default ExploreScreen;
