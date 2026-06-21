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
import {localFileService, LocalTrack} from '../../services/LocalFileService';
import {userContentService} from '../../services/UserContentService';
import {usePlayerStore} from '../../store/usePlayerStore';
import BackgroundMotif from '../../components/common/BackgroundMotif';

type FilterType = 'Titres' | 'Artistes' | 'Playlists' | 'Favoris' | 'Local' | 'Dossiers';

const LibraryScreen = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Titres');
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [artists, setArtists] = useState<ArtistData[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [localTracks, setLocalTracks] = useState<TrackData[]>([]);
  const [favorites, setFavorites] = useState<TrackData[]>([]);
  const [folders, setFolders] = useState<{name: string; trackCount: number}[]>([]);
  const [folderTracks, setFolderTracks] = useState<TrackData[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const {setCurrentTrack, setIsPlaying, playTrackFromQueue} = usePlayerStore();

  const filters: FilterType[] = ['Titres', 'Artistes', 'Playlists', 'Favoris', 'Local', 'Dossiers'];

  useEffect(() => {
    loadData();
  }, []);

  // Reload favorites when switching to the Favoris tab
  useEffect(() => {
    if (activeFilter === 'Favoris') {
      loadFavorites();
    }
  }, [activeFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [t, a, p, l, fav, f] = await Promise.all([
        musicService.getTrendingTracks(),
        musicService.getTopArtists(),
        musicService.getTopPlaylists(),
        localFileService.scanLocalMusic(),
        userContentService.getFavorites(),
        localFileService.getLocalFolders(),
      ]);
      setTracks(t);
      setArtists(a);
      setPlaylists(p);
      setLocalTracks(l as any);
      setFavorites(fav);
      setFolders(f);
    } catch (error) {
      console.error('Erreur lors du chargement de la bibliothèque :', error);
    }
    setLoading(false);
  };

  const loadFavorites = async () => {
    try {
      const fav = await userContentService.getFavorites();
      setFavorites(fav);
    } catch (_e) {}
  };

  const handlePlayTrack = (track: TrackData, queue: TrackData[] = [track]) => {
    playTrackFromQueue(track, queue);
  };

  const handleArtistPress = async (artist: ArtistData) => {
    setLoading(true);
    const artistTracks = await musicService.getArtistTracks(artist.id);
    setTracks(artistTracks);
    setActiveFilter('Titres');
    setLoading(false);
  };

  const handlePlaylistPress = async (playlist: PlaylistData) => {
    setLoading(true);
    const playlistTracks = await musicService.getPlaylistTracks(playlist.id);
    setTracks(playlistTracks);
    setActiveFilter('Titres');
    setLoading(false);
  };

  const handleFolderPress = async (folderName: string) => {
    setLoading(true);
    setSelectedFolder(folderName);
    const fTracks = await localFileService.getTracksFromFolder(folderName);
    setFolderTracks(fTracks as any);
    setLoading(false);
  };

  const getCurrentQueue = (): TrackData[] => {
    switch (activeFilter) {
      case 'Local':
        return localTracks;
      case 'Favoris':
        return favorites;
      case 'Dossiers':
        return folderTracks;
      default:
        return tracks;
    }
  };

  const renderFilter = (filter: FilterType) => (
    <TouchableOpacity
      key={filter}
      onPress={() => {
        setActiveFilter(filter);
        setSelectedFolder(null);
      }}
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
      onPress={() => handlePlayTrack(item, getCurrentQueue())}>
      <Image source={{uri: item.artwork}} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemSubtitle} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handlePlayTrack(item, getCurrentQueue())}>
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
      <Image source={{uri: item.picture}} style={styles.artistImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemSubtitle}>
          {item.fans ? `${(item.fans / 1000).toFixed(0)}K fans` : 'Artiste'}
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

  const renderFolderItem = ({item}: {item: {name: string; trackCount: number}}) => (
    <TouchableOpacity
      style={styles.folderContainer}
      onPress={() => handleFolderPress(item.name)}>
      <View style={styles.folderIcon}>
        <Icon name="folder" size={32} color={THEME.colors.primaryFixedDim} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemSubtitle}>
          {item.trackCount} fichier{item.trackCount > 1 ? 's' : ''} audio
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
      case 'Titres':
        return (
          <FlatList
            data={tracks}
            renderItem={renderTrackItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucun titre trouvé.</Text>}
          />
        );
      case 'Artistes':
        return (
          <FlatList
            data={artists}
            renderItem={renderArtistItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucun artiste trouvé.</Text>}
          />
        );
      case 'Playlists':
        return (
          <FlatList
            data={playlists}
            renderItem={renderPlaylistItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucune playlist trouvée.</Text>}
          />
        );
      case 'Favoris':
        return (
          <FlatList
            data={favorites}
            renderItem={renderTrackItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="favorite-border" size={48} color={THEME.colors.onSurfaceVariant} />
                <Text style={styles.emptyText}>Aucun favori pour le moment.</Text>
                <Text style={styles.emptyHint}>
                  Appuyez sur le cœur pour ajouter des titres à vos favoris.
                </Text>
              </View>
            }
          />
        );
      case 'Local':
        return (
          <FlatList
            data={localTracks}
            renderItem={renderTrackItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="music-off" size={48} color={THEME.colors.onSurfaceVariant} />
                <Text style={styles.emptyText}>Aucune musique trouvée sur cet appareil.</Text>
                <Text style={styles.emptyHint}>
                  Ajoutez des fichiers MP3 dans le stockage de votre téléphone.
                </Text>
              </View>
            }
          />
        );
      case 'Dossiers':
        if (selectedFolder) {
          return (
            <View>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedFolder(null)}>
                <Icon name="arrow-back" size={24} color={THEME.colors.primaryFixedDim} />
                <Text style={styles.backButtonText}>Retour aux dossiers</Text>
              </TouchableOpacity>
              <Text style={styles.folderTitle}>{selectedFolder}</Text>
              <FlatList
                data={folderTracks}
                renderItem={renderTrackItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                ListEmptyComponent={<Text style={styles.emptyText}>Aucun fichier audio dans ce dossier.</Text>}
              />
            </View>
          );
        }
        return (
          <FlatList
            data={folders}
            renderItem={renderFolderItem}
            keyExtractor={item => item.name}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="folder-off" size={48} color={THEME.colors.onSurfaceVariant} />
                <Text style={styles.emptyText}>Aucun dossier audio trouvé.</Text>
              </View>
            }
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundMotif />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* En-tête */}
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Bibliothèque</Text>
            <TouchableOpacity>
              <Icon name="search" size={28} color={THEME.colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Filtres */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}>
            {filters.map(renderFilter)}
          </ScrollView>

          {/* Contenu */}
          <View style={styles.contentContainer}>{renderContent()}</View>
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
  scrollContent: {
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.marginMobile,
    paddingVertical: THEME.spacing.md,
  },
  pageTitle: {
    ...THEME.typography.displayLg,
    fontSize: 28,
    color: THEME.colors.onSurface,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.marginMobile,
    paddingBottom: THEME.spacing.md,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  activeFilterChip: {
    backgroundColor: THEME.colors.primaryFixed,
  },
  filterText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  activeFilterText: {
    color: THEME.colors.onPrimaryFixed,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: THEME.spacing.marginMobile,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: THEME.rounded.default,
  },
  artistImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
  },
  itemSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: 16,
  },
  folderIcon: {
    width: 48,
    height: 48,
    borderRadius: THEME.rounded.default,
    backgroundColor: 'rgba(0, 228, 118, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.primaryFixedDim,
    paddingHorizontal: THEME.spacing.marginMobile,
    marginBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  backButtonText: {
    ...THEME.typography.labelLg,
    color: THEME.colors.primaryFixedDim,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    ...THEME.typography.bodyLg,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyHint: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default LibraryScreen;
