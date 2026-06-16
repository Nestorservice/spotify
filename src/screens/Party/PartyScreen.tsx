import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { THEME } from '../../theme';
import { usePartyStore } from '../../store/usePartyStore';
import RadarAnimation from '../../components/party/RadarAnimation';
import BackgroundMotif from '../../components/common/BackgroundMotif';

const PartyScreen = () => {
  const { 
    currentSession, 
    collaborativeQueue, 
    isSearching, 
    discoveredSessions,
    setIsSearching 
  } = usePartyStore();

  useEffect(() => {
    setIsSearching(true);
  }, []);

  const renderParticipant = ({ item }: { item: any }) => (
    <View style={styles.participantContainer}>
      <View style={[styles.avatarBorder, item.isHost && styles.hostBorder]}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isActive && <View style={styles.activeDot} />}
      </View>
      <Text style={styles.participantName} numberOfLines={1}>{item.name}</Text>
    </View>
  );

  const renderQueueItem = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.queueItem, index === 0 && styles.nowPlayingItem]}>
      <Image source={{ uri: item.track.artwork }} style={styles.queueArtwork} />
      <View style={styles.queueInfo}>
        <Text style={[styles.queueTitle, index === 0 && styles.primaryText]}>{item.track.title}</Text>
        <Text style={styles.queueArtist}>{item.track.artist} • 03:42</Text>
      </View>
      <View style={styles.addedBy}>
        <Image source={{ uri: item.addedBy.avatar }} style={styles.addedByAvatar} />
        {index === 0 && <Text style={styles.hostLabel}>Host</Text>}
      </View>
      {index === 0 && (
        <View style={styles.playbackProgress}>
          <View style={[styles.progressFill, { width: '45%' }]} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <BackgroundMotif />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Icon name="cell-tower" size={24} color={THEME.colors.primaryFixedDim} />
            </View>
            <Text style={styles.headerTitle}>Session Locale Active</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Icon name="settings" size={24} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>
            <View style={styles.smallProfile}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM4-yMLaTqv9lrCkbyhQk0vOL-q_Kbhkh_fZHeIZoQDUTNqg-ffXeSJgWr797WDIpFhuY-3FvK0IfozpfcEVuDTTIcOv41EfUnmagapH7wHehahlk634KuR2J7hsOXVd84n3LWy6XBuuYrl6dYcPJwvg4ZoCFaq_iErgIALWswQO-c6wLIsssxiDv7QChDFMynCKXUwvZG8ixJGH3ciE_Mmo-jDfcp8gYDT0JS9WpSgni7k3MuLaiGF9kmjk7puy1DdaYgRJ_YimSU' }} 
                style={styles.fullImage} 
              />
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Radar Section */}
          <View style={styles.radarSection}>
            <RadarAnimation />
            <View style={styles.radarCenter}>
              <View style={styles.hubIcon}>
                <Icon name="hub" size={40} color={THEME.colors.primaryFixed} />
              </View>
              <Text style={styles.radarLabel}>SCANNING FOR PEERS</Text>
            </View>
          </View>

          {/* Participants */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Listening</Text>
              <Text style={styles.participantCount}>5 Connected</Text>
            </View>
            <FlatList
              data={MOCK_PARTICIPANTS}
              renderItem={renderParticipant}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.participantsList}
              ListFooterComponent={
                <TouchableOpacity style={styles.addParticipant}>
                  <View style={styles.addIconCircle}>
                    <Icon name="person-add" size={24} color={THEME.colors.onSurfaceVariant} />
                  </View>
                  <Text style={styles.addLabel}>Invite</Text>
                </TouchableOpacity>
              }
            />
          </View>

          {/* Shared Queue */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shared Queue</Text>
            <View style={styles.queueContainer}>
              {MOCK_QUEUE.map((item, index) => (
                <React.Fragment key={index}>
                  {renderQueueItem({ item, index })}
                </React.Fragment>
              ))}
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity style={styles.fab}>
          <Icon name="add" size={32} color={THEME.colors.onPrimaryFixed} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const MOCK_PARTICIPANTS = [
  { id: '1', name: 'Amara', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-paOgR_mLvdMuwr87T_mCDeAW-3TysfPA0op-kjEUNGbn0ryGVpHQdy-TMkkLj-1GrbGKKZ2pu4pHWjdd0j_MI07ZCicyJRGlTG6cZivekfP-XqmXVzoZtlMM6pUE22SwoYroc6Sp5ti6yeBI78suqf6owmiapicTTWZz6Z8keX7DOhYxhZrJQedbtw5FGx-uX8WPKTPGT9VsVqn8Odljo-lB_lJ1ofmEWpDWPdGn7pW0MkbFxqIj0sr6vnbU3JxIlQ0y1V7g1qkP', isHost: true, isActive: true },
  { id: '2', name: 'Kofi', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj1x7fSWGin9oFjm-tbGfTVQZSiRAqYBt5HjOGsGyDoPJa4XByQK_x6rTTmcvt0fOlwS63_BpLSJNq3oVmfudnYY9icug8SPM-fVMzrJz7N45fa3ESFBP4l0Yr5ygK9puyvg48xRTdNNtmO4OxYqujUrpx5LEYawl-bNWMWWyHrfPoyA7jO8htR3jEqz8BXyvSMM1O9WzX1gsvBU5vrujSwK3j7Kgef00ALgd4TaEe_rigbdEVI8n5ILuQS2usl8fMSBveoxQBV1t9' },
  { id: '3', name: 'Zanele', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxTPPZlzrjsMwmX3T_6S4FH2K1_qwotAuoxMADNpVCofbsU9AkvVkDYTmHLCwFKM29bFFLP2Fwaqn9plkWMMx3qbwW7UPoY2tDDU5x5OaPA2XSHjzTeIjabx0yFgVDJn-Yt-rwWFS_v_zzD8qOIZIgEhX_2M_BdiEzh1245W26EL0p4oD7AxijsaGEV-AtxrusC6aj2mvNCOkfEEMBCoKv3aKye2hB6-kYEG0TwqyXftiQlYK8ibePcSovXfh8_Vkzyk1Ye0TxAp4r' },
  { id: '4', name: 'Jabari', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9h6k1ylkNRKVSnswtS77hpUJLjc315E3MUiIBnL6QVSQir-ccpcceqo97vtLtnGremSnlo4e6X14Iv-sLil7q_mana1kQYdEcfCmlirRoP8xbJfnK-xdefpE9pEi3xiwPV-vKyJfAQeaGpQvi61Sbq-j_80_nNyoSHxsHfGET6F1JAurlJdxzGkZOgCLNiBvd8NBmfa2nHWH2D6F3HRyBBKcpeldOwOfIAixYY03SLzWGaADn05fTYZStf6cMW53HmILzqVTq4zk2' },
];

const MOCK_QUEUE = [
  { track: { title: 'Logdrum Ritual', artist: 'Musa Keys', artwork: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZl6tR1L5AHtSqH3ReIfSikWmS1iIEwWH5IZUIZC8O76bqMctYRlctUPSrWG04PZLwz79NWvnCMAfHsrlZNRLZoEryytrs-ExN8uAmhENBCxD-g6duDS_sgFOGAjleTswTZQfxFs7CqVvR0ddN5g0QQ-kUMgqAXFlkcIKnHa84FscN6LZC0sQ6IekO8DMaGTkCNOVUgSdV_DZPstRdv2Z5gGFBmpFMMiFZuI_i5xha3qoQUnuS7O_idv8KPQ4TCU1ZYkp9rzP56wyi' }, addedBy: MOCK_PARTICIPANTS[0] },
  { track: { title: 'Summer High', artist: 'Davido', artwork: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSYwSItPrZvE1EYzhifmJio3PMDdUAFCgNCielsiP8Iml48A0TdbIDJNYVvIWT8qN_LhMfixfeG9l78hEq6A2tsKhRb-3S8jMhSIourpWWtoGwyj2zI_NK88d2rXIZMIGQtDFHHJS8D2e5LLCl9EEBsRntT5eNqNJXpXKOE5fRU5nEfGGG8pQepFwjvkA_hRj-HIy7UXBVUJpp6TBZGe8j5Y4qgDhv493tqlfwI071Lfn_aQcRsZMU8jIu9Wb7vgy9dpwtucq2WzRn' }, addedBy: MOCK_PARTICIPANTS[1] },
  { track: { title: 'Mnike (Remix)', artist: 'Tyler ICU', artwork: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrEu7Ie3Q9LsKFkI05gYMyKFRBlNF4NhwLqu4TSVWrvtd-QczOcbB8Iwhlu-z7OuGIjmim4TmBfUiIAj71ymYgy05Y1s0ocjoqLEOGQhHHFgCh8mj2NyYfsN2xti0H_VY1aID_Lh_FKt2j-_lDnf9B_O6TgHGf6sJMFTwM6Iw1DKWc8oE3IrTdYxzojXVsnCmOGcdii1oImTMPufbpGny0Q2yRR-nSRtcwN9FuN0UccN3Sdg_Bpa4T52vA-1_g1JECSjExACJ3trs8' }, addedBy: MOCK_PARTICIPANTS[2] },
];

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
    gap: 12,
  },
  iconCircle: {
    padding: 8,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: 20,
  },
  headerTitle: {
    ...THEME.typography.headlineMd,
    fontSize: 20,
    color: THEME.colors.primaryFixedDim,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  smallProfile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.outlineVariant,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  radarSection: {
    height: 240,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(97, 255, 151, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(97, 255, 151, 0.3)',
  },
  radarLabel: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryFixed,
    marginTop: 16,
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
    width: 72,
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
  addParticipant: {
    alignItems: 'center',
    marginRight: THEME.spacing.marginMobile,
  },
  addIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: THEME.colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addLabel: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 12,
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
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
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
  addedBy: {
    alignItems: 'flex-end',
    gap: 4,
  },
  addedByAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.primaryFixed,
  },
  hostLabel: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.primaryFixed,
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
});

export default PartyScreen;
