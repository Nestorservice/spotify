import React, { useState } from 'react';
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
import BackgroundMotif from '../../components/common/BackgroundMotif';

const LibraryScreen = () => {
  const [activeFilter, setActiveFilter] = useState('Playlists');

  const filters = ['Playlists', 'Albums', 'Artists', 'Downloads'];

  const renderFilter = (filter: string) => (
    <TouchableOpacity
      key={filter}
      onPress={() => setActiveFilter(filter)}
      style={[
        styles.filterChip,
        activeFilter === filter && styles.activeFilterChip,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          activeFilter === filter && styles.activeFilterText,
        ]}
      >
        {filter}
      </Text>
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
            <Icon name="settings" size={24} color={THEME.colors.primaryFixedDim} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
            {filters.map(renderFilter)}
          </ScrollView>

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Library</Text>
            <TouchableOpacity style={styles.sortButton}>
              <Icon name="sort" size={20} color={THEME.colors.onSurfaceVariant} />
              <Text style={styles.sortText}>Recent</Text>
            </TouchableOpacity>
          </View>

          {/* Library Items */}
          <View style={styles.libraryList}>
            <LibraryItem 
              title="Liked Songs" 
              subtitle="Playlist • 428 songs" 
              icon="favorite" 
              gradient 
            />
            <LibraryItem 
              title="Amapiano Rituals" 
              subtitle="Playlist • Sauti Curated" 
              artwork="https://lh3.googleusercontent.com/aida-public/AB6AXuCPpRB_9lKZ_BiZHRVOnpiAK_2q3TkbY1v2dk5DID7QN2kolkv7_8lsyDS6x8D5LyCAu2tSdMj_XBiMYhJ_Wnmp_pYQibhfR8iIUAb70FUyWLcjKfXWbe0AIplZtkhvxdDKjgsr-Zr3BhZ4WPkrZgI38duTr7Ff2Yu3-6hz-2H_oHaN7P3mF21jV2ItL2-rI8i1I5blc2nY2U2G5H0Fos4KBpjlRE0tJmgj7TVwcStevOfsnEzdR1RNkk0bPujvtEhosbHl2OhvWFji" 
            />
            <LibraryItem 
              title="African Giant" 
              subtitle="Album • Burna Boy" 
              artwork="https://lh3.googleusercontent.com/aida-public/AB6AXuC43K2sOnFgHhf9nWuKnEFQmI9bC-ctywYurX_uaWDS04JQRbTYZBvt1xW_bMM0n6CwDv3tUOBzzdeCiXM65TP4cXoz7GKDLXCA8CNIZY3mnCehb-a6bmhPNK8pT7yVLYhNUA7ZeaM-qvGU4YTH0d0DwJgFnCLdYd4XMdxdD5u2_HDLhiGIrz1j_rRLXXqH_3a9a6QUDdc66rhTafIVLrMR6ffJRLKlFU2H3tOLXGCz7LshZoZU08g33MrRDw74wzVQ9LAJmyzHHNHS" 
              downloaded
            />
            <LibraryItem 
              title="Afro-House Essentials" 
              subtitle="Playlist • 120 songs" 
              artwork="https://lh3.googleusercontent.com/aida-public/AB6AXuDcIiH22NSjb_Cuk9oRb8aR67svueOHbctJuVzd-4U4NwslfKeXrzaBQWGh2zHTMA7LjwfmpMJax1WepibFNYqsJd1P3QxUVBtNoymFHH4EepoRnFazVWv0nYOPvWcw6lAtbbYgdKxy0CDkwviEhf7Wh6PeOgb3ijBbF5I_MBsyc9egSY_cWDuhSC0Ev-NFA2rL6RwVHe_nYNUQq8KDQ7ZbP5yiJ02TrQul93b5o2gpugcQbabh53Wb1FzaDwcE3X0rvPKMvWm7AA1G" 
            />
            <LibraryItem 
              title="Wizkid" 
              subtitle="Artist" 
              artwork="https://lh3.googleusercontent.com/aida-public/AB6AXuAjaFTqWxgAUcdJR1VzBwlKabuQeWN8KyVvDJlN59tf82OeUP8iYNtZtHMOr0ldf9dROlIvEzG6C0dMCSa7Aj-K1if21WviFDXbrXQOmxKjII5o8HhXlpyFEZcfKd-0egK2F3DeGgs-2NwjkFs4ejp4gQDml6B0Ia73MfA4biYlgKiUbwX-SyuaPFS5CEG6DxQtueMWNi20Uib-k7cV16DRyYY_vN0SQSEpr79JUxYJ0EHVj9dEC1PrnCD3iZ1g_jVOnvt0yJ8reIgo" 
              rounded 
            />
          </View>

          <View style={{ height: 160 }} />
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity style={styles.fab}>
          <Icon name="add" size={32} color={THEME.colors.onTertiaryFixed} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const LibraryItem = ({ title, subtitle, artwork, icon, gradient, downloaded, rounded }: any) => (
  <TouchableOpacity style={styles.itemContainer}>
    {gradient ? (
      <View style={[styles.itemImage, styles.gradientBg]}>
        <Icon name={icon} size={32} color={THEME.colors.onPrimaryContainer} />
      </View>
    ) : (
      <Image 
        source={{ uri: artwork }} 
        style={[styles.itemImage, rounded && styles.roundedImage]} 
      />
    )}
    <View style={styles.itemInfo}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemSubtitle}>{subtitle}</Text>
    </View>
    {downloaded && (
      <Icon name="download-done" size={20} color={THEME.colors.primaryFixedDim} />
    )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.marginMobile,
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    ...THEME.typography.headlineLgMobile,
    color: THEME.colors.onBackground,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurfaceVariant,
  },
  libraryList: {
    paddingHorizontal: THEME.spacing.marginMobile - 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: THEME.rounded.lg,
    gap: 16,
    marginBottom: 8,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: THEME.rounded.default,
    backgroundColor: THEME.colors.surfaceContainer,
  },
  gradientBg: {
    backgroundColor: THEME.colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundedImage: {
    borderRadius: 32,
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
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 110,
    right: THEME.spacing.marginMobile,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.tertiaryFixedDim,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});

export default LibraryScreen;
