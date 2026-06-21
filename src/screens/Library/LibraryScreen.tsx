import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {THEME} from '../../theme';
import {musicService, TrackData, ArtistData, PlaylistData} from '../../services/MusicService';
import {localFileService} from '../../services/LocalFileService';
import {usePlayerStore} from '../../store/usePlayerStore';
import BackgroundMotif from '../../components/common/BackgroundMotif';

type FilterType = 'Tracks' | 'Artists' | 'Playlists' | 'Local';

const LibraryScreen = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tracks');
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [artists, setArtists] = useState<ArtistData[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [localTracks, setLocalTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const {setCurrentTrack, setIsPlaying, playTrackFromQueue} = usePlayerStore();

  const filters: FilterType[] = ['Tracks', 'Artists', 'Playlists', 'Local'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [t, a, p, l] = await Promise.all([
        musicService.getTrendingTracks(),
        musicService.getTopArtists(),
        musicService.getTopPlaylists(),
        localFileService.scanLocalMusic(),
      ]);
      setTracks(t);
      setArtists(a);
      setPlaylists(p);
      setLocalTracks(l as any);
    } catch (error) {
      console.error('Error loading library data:', error);
    }
    setLoading(false);
  };

  const handlePlayTrack = (track: TrackData, queue: TrackData[] = [track]) => {
    playTrackFromQueue(track, queue);
  };

  const handleArtistPress = async (artist: ArtistData) => {
    setLoading(true);
    const artistTracks = await musicService.getArtistTracks(artist.id);
    setTracks(artistTracks);
    setActiveFilter('Tracks');
    setLoading(false);
  };

  const handlePlaylistPress = async (playlist: PlaylistData) => {
    setLoading(true);
    const playlistTracks = await musicService.getPlaylistTracks(playlist.id);
    setTracks(playlistTracks);
    setActiveFilter('Tracks');
    setLoading(false);
  };

  const renderFilter = (filter: FilterType) => (
    <TouchableOpacity
      key={filter}
      onPress={() => setActiveFilter(filter)}
      style={[
        styles.filterChip,
        activeFilter === filter && styles.activeFilterChip,
      ]}>
      <Text
        style={[
          styles.filterText,
          activeFilter === filter && styles.activeFilterText,
        ]}>
        {filter}
      </Text>
    </TouchableOpacity>
  );

  const renderTrackItem = ({item}: {item: TrackData}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handlePlayTrack(item, activeFilter === 'Local' ? localTracks : tracks)}>
      <Image source={{uri: item.artwork}} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemSubtitle} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handlePlayTrack(item, activeFilter === 'Local' ? localTracks : tracks)}>
        <Icon
          name="play-circle-outline"
          size={28}
          color={THEME.colors.primaryFixedDim}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderArtistItem = ({item}: {item: ArtistData}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleArtistPress(item)}>
      <Image source={{uri: item.picture}} style={styles.roundedImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemSubtitle}>
          {item.fans
            ? `${(item.fans / 1000000).toFixed(1)}M fans`
            : 'Artiste'}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color={THEME.colors.onSurfaceVariant} />
    </TouchableOpacity>
  );

  const renderPlaylistItem = ({item}: {item: PlaylistData}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handlePlaylistPress(item)}>
      <Image source={{uri: item.picture}} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemSubtitle}>
          {item.trackCount} titres{item.creator ? ` • ${item.creator}` : ''}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color={THEME.colors.onSurfaceVariant} />
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color={THEME.colors.primaryFixedDim}
          style={{marginTop: 40}}
        />
      );
    }

    switch (activeFilter) {
      case 'Tracks':
        return (
          <FlatList
            data={tracks}
            renderItem={renderTrackItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        );
      case 'Artists':
        return (
          <FlatList
            data={artists}
            renderItem={renderArtistItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        );
      case 'Playlists':
        return (
          <FlatList
            data={playlists}
            renderItem={renderPlaylistItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        );
      case 'Local':
        return (
          <FlatList
            data={localTracks}
            renderItem={renderTrackItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundMotif />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>Bibliothèque</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersRow}>
            {filters.map(renderFilter)}
          </ScrollView>

          {/* Content */}
          <View style={styles.listContainer}>{renderContent()}</View>

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
  filtersRow: {
    paddingLeft: THEME.spacing.marginMobile,
    marginBottom: THEME.spacing.lg,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(132, 149, 132, 0.3)',
    marginRight: 12,
  },
  activeFilterChip: {
    borderColor: THEME.colors.primaryFixed,
    backgroundColor: 'rgba(0, 228, 118, 0.1)',
  },
  filterText: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurfaceVariant,
  },
  activeFilterText: {
    color: THEME.colors.primaryFixed,
  },
  listContainer: {
    paddingHorizontal: THEME.spacing.marginMobile,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: THEME.rounded.default,
    backgroundColor: THEME.colors.surfaceContainer,
  },
  roundedImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.surfaceContainer,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    ...THEME.typography.bodyLg,
    fontWeight: '600',
    color: THEME.colors.onSurface,
  },
  itemSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
});

export default LibraryScreen;
