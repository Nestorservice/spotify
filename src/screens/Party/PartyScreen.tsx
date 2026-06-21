import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { THEME } from '../../theme';
import { usePartyStore, Participant } from '../../store/usePartyStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { musicService, TrackData } from '../../services/MusicService';
import RadarAnimation from '../../components/party/RadarAnimation';
import BackgroundMotif from '../../components/common/BackgroundMotif';

const PartyScreen = () => {
  const {
    currentSession,
    isSearching,
    supabaseConnected,
    createSession,
    joinSession,
    leaveSession,
    shareSession,
    requestAddTrack,
  } = usePartyStore();

  const {
    currentTrack,
    queue,
    playTrackFromQueue,
    currentTime,
    duration,
  } = usePlayerStore();

  // Local state for forms
  const [roomName, setRoomName] = useState('La Fête Sauti');
  const [joinCode, setJoinCode] = useState('');
  const [nickname, setNickname] = useState('Mélomane');

  // Search Modal state
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TrackData[]>([]);
  const [searchingTracks, setSearchingTracks] = useState(false);

  const handleCreate = async () => {
    const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop';
    await createSession(roomName, nickname, avatar);
  };

  const handleJoin = async () => {
    if (!joinCode) return;
    const avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop';
    await joinSession(joinCode.toUpperCase().trim(), nickname, avatar);
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      setSearchingTracks(true);
      try {
        const results = await musicService.searchTracks(text);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching tracks:', err);
      }
      setSearchingTracks(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddTrack = (track: TrackData) => {
    if (currentSession?.role === 'host') {
      // Host adds directly
      usePlayerStore.getState().addToQueue(track);
    } else if (currentSession?.role === 'guest') {
      // Guest requests addition
      const avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop';
      requestAddTrack(track, nickname, avatar);
    }
    setSearchVisible(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const renderParticipant = ({ item }: { item: Participant }) => (
    <View style={styles.participantContainer}>
      <View style={[styles.avatarBorder, item.isHost && styles.hostBorder]}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isActive && <View style={styles.activeDot} />}
      </View>
      <Text style={styles.participantName} numberOfLines={1}>
        {item.name} {item.isHost && '(Hôte)'}
      </Text>
    </View>
  );

  const renderQueueItem = ({ item, index }: { item: any; index: number }) => {
    const isCurrent = item.id === currentTrack?.id;
    return (
      <TouchableOpacity
        style={[styles.queueItem, isCurrent && styles.nowPlayingItem]}
        onPress={() => playTrackFromQueue(item, queue as any)}
      >
        <Image source={{ uri: item.artwork }} style={styles.queueArtwork} />
        <View style={styles.queueInfo}>
          <Text style={[styles.queueTitle, isCurrent && styles.primaryText]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.queueArtist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
        {isCurrent && (
          <View style={styles.playbackProgress}>
            <View
              style={[
                styles.progressFill,
                { width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` },
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BackgroundMotif />
      <SafeAreaView style={styles.safeArea}>
        {/* Onboarding View (No Active Room) */}
        {!currentSession ? (
          <ScrollView
            contentContainerStyle={styles.onboardingContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroSection}>
              <Icon name="cell-tower" size={64} color={THEME.colors.primaryFixed} />
              <Text style={styles.heroTitle}>Mode Fête (Session)</Text>
              <Text style={styles.heroDescription}>
                Écoutez de la musique ensemble en temps réel. Partagez le contrôle de la file d'attente avec vos amis.
              </Text>
            </View>

            {/* Warning Banner if Supabase not configured */}
            {!supabaseConnected && (
              <View style={styles.warningBanner}>
                <Icon name="warning" size={20} color="#ffb4a4" />
                <Text style={styles.warningText}>
                  Mode démo locale actif. Configurez les clés Supabase dans SupabaseService.ts pour la synchronisation réelle.
                </Text>
              </View>
            )}

            {/* Setup Form */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Votre Pseudo</Text>
              <TextInput
                style={styles.textInput}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Votre nom"
                placeholderTextColor={THEME.colors.onSurfaceVariant}
              />
            </View>

            {/* Host Section */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Créer une Session Fête</Text>
              <TextInput
                style={styles.textInput}
                value={roomName}
                onChangeText={setRoomName}
                placeholder="Nom du salon"
                placeholderTextColor={THEME.colors.onSurfaceVariant}
              />
              <TouchableOpacity style={styles.primaryButton} onPress={handleCreate}>
                <Text style={styles.primaryButtonText}>Lancer la fête</Text>
                <Icon name="chevron-right" size={20} color={THEME.colors.onPrimaryFixed} />
              </TouchableOpacity>
            </View>

            {/* Join Section */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Rejoindre une Session</Text>
              <TextInput
                style={styles.textInput}
                value={joinCode}
                onChangeText={setJoinCode}
                placeholder="Code de session (Ex: AB12CD)"
                placeholderTextColor={THEME.colors.onSurfaceVariant}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.secondaryButton} onPress={handleJoin}>
                <Text style={styles.secondaryButtonText}>Rejoindre</Text>
                <Icon name="login" size={20} color={THEME.colors.primaryFixed} />
              </TouchableOpacity>
            </View>

            {isSearching && (
              <ActivityIndicator
                size="large"
                color={THEME.colors.primaryFixed}
                style={{ marginTop: 20 }}
              />
            )}
          </ScrollView>
        ) : (
          /* Active Session View */
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.iconCircle}>
                  <Icon name="cell-tower" size={24} color={THEME.colors.primaryFixedDim} />
                </View>
                <View>
                  <Text style={styles.headerTitle} numberOfLines={1}>
                    {currentSession.name}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    CODE : {currentSession.code}
                  </Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={shareSession} style={styles.headerIconButton}>
                  <Icon name="share" size={24} color={THEME.colors.primaryFixed} />
                </TouchableOpacity>
                <TouchableOpacity onPress={leaveSession} style={styles.headerIconButton}>
                  <Icon name="exit-to-app" size={24} color="#ffb4a4" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Radar Simulation */}
              <View style={styles.radarSection}>
                <RadarAnimation />
                <View style={styles.radarCenter}>
                  <View style={styles.hubIcon}>
                    <Icon name="hub" size={40} color={THEME.colors.primaryFixed} />
                  </View>
                  <Text style={styles.radarLabel}>SESSION REALTIME SYNCED</Text>
                </View>
              </View>

              {/* Participants */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Membres connectés</Text>
                  <Text style={styles.participantCount}>
                    {currentSession.participants.length} en ligne
                  </Text>
                </View>
                <FlatList
                  data={currentSession.participants}
                  renderItem={renderParticipant}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.participantsList}
                />
              </View>

              {/* Shared Queue */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>File d'attente partagée</Text>
                <View style={styles.queueContainer}>
                  {queue.length === 0 ? (
                    <Text style={styles.emptyText}>Aucune musique dans la file d'attente.</Text>
                  ) : (
                    queue.map((item, index) => (
                      <React.Fragment key={item.id || index}>
                        {renderQueueItem({ item, index })}
                      </React.Fragment>
                    ))
                  )}
                </View>
              </View>

              <View style={{ height: 120 }} />
            </ScrollView>

            {/* FAB to Add Track */}
            <TouchableOpacity style={styles.fab} onPress={() => setSearchVisible(true)}>
              <Icon name="add" size={32} color={THEME.colors.onPrimaryFixed} />
            </TouchableOpacity>
          </View>
        )}

        {/* Add Track Search Modal */}
        <Modal
          visible={searchVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSearchVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSearchVisible(false)}>
                <Icon name="close" size={28} color={THEME.colors.onSurface} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Ajouter à la fête</Text>
              <View style={{ width: 28 }} />
            </View>

            <View style={styles.modalSearchRow}>
              <Icon name="search" size={24} color={THEME.colors.onSurfaceVariant} />
              <TextInput
                style={styles.modalSearchInput}
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Rechercher une musique, un artiste..."
                placeholderTextColor={THEME.colors.onSurfaceVariant}
                autoFocus
              />
            </View>

            {searchingTracks ? (
              <ActivityIndicator
                size="large"
                color={THEME.colors.primaryFixed}
                style={{ marginTop: 40 }}
              />
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.modalResultsList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalResultItem}
                    onPress={() => handleAddTrack(item)}
                  >
                    <Image source={{ uri: item.artwork }} style={styles.modalResultArtwork} />
                    <View style={styles.modalResultInfo}>
                      <Text style={styles.modalResultTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.modalResultArtist} numberOfLines={1}>
                        {item.artist}
                      </Text>
                    </View>
                    <Icon name="add-circle-outline" size={28} color={THEME.colors.primaryFixedDim} />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  searchQuery.length > 2 ? (
                    <Text style={styles.emptyText}>Aucun résultat trouvé.</Text>
                  ) : null
                }
              />
            )}
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
  },
  onboardingContainer: {
    paddingHorizontal: THEME.spacing.marginMobile,
    paddingTop: 40,
    gap: 20,
    paddingBottom: 120,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  heroTitle: {
    ...THEME.typography.displayLg,
    fontSize: 28,
    color: THEME.colors.primaryFixed,
    marginTop: 16,
    textAlign: 'center',
  },
  heroDescription: {
    ...THEME.typography.bodyLg,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(255, 180, 164, 0.1)',
    borderRadius: THEME.rounded.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 164, 0.2)',
  },
  warningText: {
    ...THEME.typography.labelSm,
    color: '#ffb4a4',
    flex: 1,
    lineHeight: 16,
  },
  card: {
    backgroundColor: THEME.colors.surfaceContainerLow,
    padding: 20,
    borderRadius: THEME.rounded.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardTitle: {
    ...THEME.typography.headlineMd,
    fontSize: 16,
    color: THEME.colors.onSurface,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: THEME.rounded.default,
    padding: 14,
    color: THEME.colors.onSurface,
    fontSize: 16,
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primaryFixed,
    padding: 16,
    borderRadius: THEME.rounded.default,
    gap: 8,
  },
  primaryButtonText: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onPrimaryFixed,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 228, 118, 0.1)',
    borderWidth: 1,
    borderColor: THEME.colors.primaryFixed,
    padding: 16,
    borderRadius: THEME.rounded.default,
    gap: 8,
  },
  secondaryButtonText: {
    ...THEME.typography.labelLg,
    color: THEME.colors.primaryFixed,
    fontWeight: 'bold',
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
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    padding: 8,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: 20,
  },
  headerTitle: {
    ...THEME.typography.headlineMd,
    fontSize: 18,
    color: THEME.colors.primaryFixedDim,
  },
  headerSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconButton: {
    padding: 8,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: 20,
  },
  radarSection: {
    height: 180,
    marginHorizontal: THEME.spacing.marginMobile,
    backgroundColor: THEME.colors.surfaceContainerLowest,
    borderRadius: THEME.rounded.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  radarCenter: {
    alignItems: 'center',
    zIndex: 10,
  },
  hubIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 228, 118, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 118, 0.3)',
  },
  radarLabel: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryFixed,
    marginTop: 12,
    letterSpacing: 2,
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
    paddingHorizontal: THEME.spacing.marginMobile,
    color: THEME.colors.onSurface,
    marginBottom: THEME.spacing.md,
  },
  participantCount: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  participantsList: {
    paddingLeft: THEME.spacing.marginMobile,
  },
  participantContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  avatarBorder: {
    padding: 3,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  hostBorder: {
    borderColor: THEME.colors.primaryFixed,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.colors.primaryFixedDim,
    borderWidth: 2,
    borderColor: THEME.colors.background,
  },
  participantName: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurface,
    marginTop: 8,
    textAlign: 'center',
  },
  queueContainer: {
    paddingHorizontal: THEME.spacing.marginMobile,
    gap: 12,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderRadius: THEME.rounded.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  nowPlayingItem: {
    borderColor: THEME.colors.primaryFixedDim,
    backgroundColor: 'rgba(0, 228, 118, 0.05)',
  },
  queueArtwork: {
    width: 48,
    height: 48,
    borderRadius: THEME.rounded.default,
  },
  queueInfo: {
    flex: 1,
    marginLeft: 16,
  },
  queueTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
  },
  primaryText: {
    color: THEME.colors.primaryFixedDim,
  },
  queueArtist: {
    ...THEME.typography.labelSm,
    fontSize: 12,
    color: THEME.colors.onSurfaceVariant,
  },
  playbackProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: THEME.colors.surfaceContainer,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.primaryFixedDim,
  },
  fab: {
    position: 'absolute',
    bottom: 110,
    right: THEME.spacing.marginMobile,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  emptyText: {
    ...THEME.typography.bodyLg,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.marginMobile,
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modalTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.onSurface,
  },
  modalSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceContainerLow,
    marginHorizontal: THEME.spacing.marginMobile,
    marginVertical: THEME.spacing.md,
    borderRadius: THEME.rounded.default,
    paddingHorizontal: 16,
    gap: 12,
  },
  modalSearchInput: {
    flex: 1,
    height: 48,
    color: THEME.colors.onSurface,
    fontSize: 16,
  },
  modalResultsList: {
    paddingHorizontal: THEME.spacing.marginMobile,
    gap: 12,
  },
  modalResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderRadius: THEME.rounded.lg,
    gap: 12,
  },
  modalResultArtwork: {
    width: 48,
    height: 48,
    borderRadius: THEME.rounded.default,
  },
  modalResultInfo: {
    flex: 1,
  },
  modalResultTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
  },
  modalResultArtist: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
});

export default PartyScreen;
