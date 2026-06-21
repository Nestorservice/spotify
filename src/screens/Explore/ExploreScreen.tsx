import React, {useState, useEffect} from 'react';
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
import {THEME} from '../../theme';
import {musicService, TrackData} from '../../services/MusicService';
import {usePlayerStore} from '../../store/usePlayerStore';
import BackgroundMotif from '../../components/common/BackgroundMotif';

const {width} = Dimensions.get('window');

const GENRES = [
  {title: 'Afrobeats', color: '#00ff85', keyword: 'afrobeats'},
  {title: 'Amapiano', color: '#ffb4a4', keyword: 'amapiano'},
  {title: 'Makossa', color: '#f7be1d', keyword: 'makossa'},
  {title: 'Bikutsi', color: '#e5e2e1', keyword: 'bikutsi'},
  {title: 'Highlife', color: '#00e476', keyword: 'highlife'},
  {title: 'Afro House', color: '#ffb9aa', keyword: 'afro house'},
];

const MOODS = [
  {title: 'Chill', icon: 'flare', keyword: 'chill african'},
  {title: 'Workout', icon: 'fitness-center', keyword: 'workout afro'},
  {title: 'Focus', icon: 'self-improvement', keyword: 'focus music'},
  {title: 'Party', icon: 'celebration', keyword: 'afro party'},
];

const ExploreScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(false);
  const [featuredTracks, setFeaturedTracks] = useState<TrackData[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const {setCurrentTrack, setIsPlaying, playTrackFromQueue} = usePlayerStore();

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    setLoadingFeatured(true);
    const tracks = await musicService.searchTracks('afrobeats 2024');
    setFeaturedTracks(tracks.slice(0, 5));
    setLoadingFeatured(false);
  };

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

  const handlePlayTrack = (track: TrackData, queue: TrackData[] = [track]) => {
    playTrackFromQueue(track, queue);
  };

  const handleGenrePress = async (keyword: string) => {
    setLoading(true);
    setQuery(keyword);
    const tracks = await musicService.searchTracks(keyword);
    setResults(tracks);
    setLoading(false);
  };

  const handleMoodPress = async (keyword: string) => {
    setLoading(true);
    setQuery(keyword);
    const tracks = await musicService.searchTracks(keyword);
    setResults(tracks);
    setLoading(false);
  };

  const renderSearchResult = ({item}: {item: TrackData}) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handlePlayTrack(item, results)}>
      <Image source={{uri: item.artwork}} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.resultArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handlePlayTrack(item, results)}>
        <Icon
          name="play-circle-outline"
          size={28}
          color={THEME.colors.primaryFixedDim}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BackgroundMotif />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>Explorer</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Icon
                name="search"
                size={24}
                color={THEME.colors.onSurfaceVariant}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Artistes, titres ou genres..."
                placeholderTextColor={THEME.colors.onSurfaceVariant}
                value={query}
                onChangeText={handleSearch}
              />
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setQuery('');
                    setResults([]);
                  }}>
                  <Icon
                    name="close"
                    size={20}
                    color={THEME.colors.onSurfaceVariant}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Search Results */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color={THEME.colors.primaryFixedDim}
              style={{marginVertical: 20}}
            />
          ) : results.length > 0 ? (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsLabel}>
                {results.length} résultats
              </Text>
              <FlatList
                data={results}
                renderItem={renderSearchResult}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.resultsList}
              />
            </View>
          ) : (
            <>
              {/* Featured / Daily Discovery */}
              {!loadingFeatured && featuredTracks.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Découverte du Jour
                  </Text>
                  <TouchableOpacity
                    style={styles.heroCard}
                    onPress={() => handlePlayTrack(featuredTracks[0], featuredTracks)}>
                    <Image
                      source={{uri: featuredTracks[0].artwork}}
                      style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay}>
                      <Text style={styles.heroBadge}>A L'HONNEUR</Text>
                      <Text style={styles.heroTitle}>
                        {featuredTracks[0].title}
                      </Text>
                      <Text style={styles.heroArtist}>
                        {featuredTracks[0].artist}
                      </Text>
                      <View style={styles.heroPlayBtn}>
                        <Icon name="play-arrow" size={20} color="#000" />
                        <Text style={styles.heroPlayText}>ECOUTER</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {/* Explore Genres */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Explorer par Genre</Text>
                <View style={styles.genreGrid}>
                  {GENRES.map(genre => (
                    <TouchableOpacity
                      key={genre.title}
                      style={[
                        styles.genreCard,
                        {backgroundColor: `${genre.color}15`},
                      ]}
                      onPress={() => handleGenrePress(genre.keyword)}>
                      <Text style={[styles.genreTitle, {color: genre.color}]}>
                        {genre.title}
                      </Text>
                      <Icon
                        name="play-arrow"
                        size={20}
                        color={genre.color}
                        style={styles.genreIcon}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Moods & Moments */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ambiances</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.moodsRow}>
                  {MOODS.map(mood => (
                    <TouchableOpacity
                      key={mood.title}
                      style={styles.moodCard}
                      onPress={() => handleMoodPress(mood.keyword)}>
                      <View style={styles.moodCircle}>
                        <Icon
                          name={mood.icon}
                          size={32}
                          color={THEME.colors.primaryFixedDim}
                        />
                      </View>
                      <Text style={styles.moodTitle}>{mood.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* More featured tracks */}
              {featuredTracks.length > 1 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>En ce moment</Text>
                  {featuredTracks.slice(1).map(track => (
                    <TouchableOpacity
                      key={track.id}
                      style={styles.resultItem}
                      onPress={() => handlePlayTrack(track, featuredTracks)}>
                      <Image
                        source={{uri: track.artwork}}
                        style={styles.resultImage}
                      />
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultTitle} numberOfLines={1}>
                          {track.title}
                        </Text>
                        <Text style={styles.resultArtist} numberOfLines={1}>
                          {track.artist}
                        </Text>
                      </View>
                      <Icon
                        name="play-circle-outline"
                        size={28}
                        color={THEME.colors.primaryFixedDim}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          <View style={{height: 120}} />
        </ScrollView>
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
  },
  header: {
    paddingHorizontal: THEME.spacing.marginMobile,
    paddingVertical: THEME.spacing.md,
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
    height: 200,
    borderRadius: THEME.rounded.lg,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroBadge: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryFixed,
    marginBottom: 4,
    letterSpacing: 2,
  },
  heroTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.white,
  },
  heroArtist: {
    ...THEME.typography.labelLg,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  heroPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.primaryFixedDim,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  heroPlayText: {
    ...THEME.typography.labelSm,
    color: '#000',
    fontWeight: '700',
    letterSpacing: 1,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: THEME.spacing.marginMobile,
    gap: 12,
  },
  genreCard: {
    width: (width - THEME.spacing.marginMobile * 2 - 12) / 2,
    height: 100,
    borderRadius: THEME.rounded.lg,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  genreTitle: {
    ...THEME.typography.headlineMd,
    fontSize: 18,
  },
  genreIcon: {
    alignSelf: 'flex-end',
    opacity: 0.6,
  },
  moodsRow: {
    paddingLeft: THEME.spacing.marginMobile,
  },
  moodCard: {
    alignItems: 'center',
    marginRight: 24,
  },
  moodCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  resultsLabel: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    paddingHorizontal: THEME.spacing.marginMobile,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultsList: {
    paddingHorizontal: THEME.spacing.marginMobile,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: THEME.spacing.marginMobile,
    gap: 14,
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
    marginTop: 2,
  },
});

export default ExploreScreen;
