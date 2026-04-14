import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  BackHandler,
  StatusBar,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

import Feather from 'react-native-vector-icons/Feather';

import {
  getDashboardSummary,
  getDashboardHistory,
} from '../../../services/dashboard';
import SummaryCards from '../../../components/dashboard/SummaryCards';
import DisasterListItem from '../../../components/dashboard/DisasterListItem';
import styles from '../../../styles/bencana/dashboardBencanaStyle';
import { useLayout } from '../../../contexts/LayoutContext';
import { generateDashboardMapHTML } from '../../../utils/maps/dashboardMapHtml';
import { TodayMarker } from '../../../types/bencana';

type TimeFilter = 'Hari Ini' | '7 Hari' | '30 Hari';
type StatusFilter = 'Semua' | 'Aman' | 'Waspada' | 'Bahaya';

const DashboardBencanaScreen = () => {
  const navigation = useNavigation<any>();
  const webViewRef = useRef<WebView>(null);
  const isFirstLoad = useRef(true);
  const flatListRef = useRef<FlatList>(null);

  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();

  const [summary, setSummary] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter State
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Hari Ini');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Semua');

  // Toggle Visibility State (Hide and View)
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  /* ================= HELPERS ================= */

  const isSameDay = (dateStr: string) => {
    if (!dateStr) return false;
    const itemDate = new Date(dateStr);
    const today = new Date();
    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  };

  /* ================= API ================= */

  const fetchSummary = async (time = timeFilter) => {
    try {
      const res = await getDashboardSummary({ time });
      if (res.data.success) setSummary(res.data.data);
    } catch (e) {
      console.log('Gagal ambil summary', e);
    }
  };

  const fetchHistory = async (
    pageNum = 1,
    refresh = false,
    time = timeFilter,
    status = statusFilter,
  ) => {
    try {
      const res = await getDashboardHistory({
        page: pageNum,
        time: time,
        status: status,
      });

      if (res.data.success) {
        const result = res.data.data;
        setLastPage(result.last_page);
        setData(prev => (refresh ? result.data : [...prev, ...result.data]));
      }
    } catch (e) {
      console.log('Gagal ambil history', e);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await Promise.all([
      fetchSummary(timeFilter),
      fetchHistory(1, true, timeFilter, statusFilter),
    ]);
    setRefreshing(false);
  }, [timeFilter, statusFilter]);

  const loadMore = async () => {
    if (loading || loadingMore || refreshing || page >= lastPage) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchHistory(nextPage, false, timeFilter, statusFilter);
    setLoadingMore(false);
  };

  /* ================= EFFECT ================= */

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('Main', { screen: 'Home' });
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  useEffect(() => {
    setTitle('Lapor Bencana');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);

    setOnBack(() => () => {
      navigation.navigate('Main', { screen: 'Home' });
      return true;
    });

    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (isFirstLoad.current) {
        setLoading(true);
        isFirstLoad.current = false;
      } else {
        setRefreshing(true);
        if (!loading) {
          flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
        }
      }

      setPage(1);
      await Promise.all([
        fetchSummary(timeFilter),
        fetchHistory(1, true, timeFilter, statusFilter),
      ]);

      setLoading(false);
      setRefreshing(false);
    };

    loadData();
  }, [timeFilter, statusFilter]);

  /* ================= MAP MARKERS ================= */

  const todayMarkers: TodayMarker[] = data
    .map(item => {
      if (!item.lokasi) return null;
      if (!isSameDay(item.created_at)) return null;
      const [lat, lng] = item.lokasi.split(',').map(Number);
      return { id: item.id, lat, lng, title: item.jenis_bencana };
    })
    .filter((m): m is TodayMarker => m !== null);

  /* ================= HEADER ================= */

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.sectionLabel}>PETA SEBARAN</Text>

      {todayMarkers.length > 0 ? (
        <View style={styles.mapCard}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            style={styles.map}
            scrollEnabled={false}
            source={{ html: generateDashboardMapHTML(todayMarkers) }}
            onMessage={event => {
              const { id } = JSON.parse(event.nativeEvent.data);
              navigation.navigate('DetailBencana', { id });
            }}
          />
          <View style={styles.zoomControls}>
            <Pressable
              style={styles.zoomBtn}
              onPress={() =>
                webViewRef.current?.postMessage(
                  JSON.stringify({ type: 'ZOOM_IN' }),
                )
              }
            >
              <Text style={styles.zoomText}>＋</Text>
            </Pressable>
            <Pressable
              style={styles.zoomBtn}
              onPress={() =>
                webViewRef.current?.postMessage(
                  JSON.stringify({ type: 'ZOOM_OUT' }),
                )
              }
            >
              <Text style={styles.zoomText}>－</Text>
            </Pressable>
            <Pressable
              style={styles.zoomBtnReset}
              onPress={() =>
                webViewRef.current?.postMessage(
                  JSON.stringify({ type: 'RESET_ZOOM' }),
                )
              }
            >
              <Text style={styles.zoomResetText}>⟳</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.emptyText}>Tidak ada laporan hari ini</Text>
        </View>
      )}

      {/* ================= SECTION: RINGKASAN ================= */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionLabelInline}>
          RINGKASAN LAPORAN{' '}
          <Text style={styles.activeFilterText}>({timeFilter})</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setShowTimeFilter(!showTimeFilter)}
          style={styles.iconButton}
          activeOpacity={0.6}
        >
          {/* MENGGUNAKAN IKON FEATHER */}
          <Feather
            name={showTimeFilter ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {showTimeFilter && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {['Hari Ini', '7 Hari', '30 Hari'].map(time => (
            <Pressable
              key={time}
              style={[
                styles.filterChip,
                timeFilter === time && styles.filterChipActive,
              ]}
              onPress={() => {
                setTimeFilter(time as TimeFilter);
                setShowTimeFilter(false);
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  timeFilter === time && styles.filterTextActive,
                ]}
              >
                {time}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={{ paddingHorizontal: 4 }}>
        <SummaryCards
          data={summary}
          timeFilter={timeFilter}
          loading={loading}
        />
      </View>

      {/* ================= SECTION: RIWAYAT ================= */}
      <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
        <Text style={styles.sectionLabelInline}>
          RIWAYAT LAPORAN{' '}
          <Text style={styles.activeFilterText}>({statusFilter})</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setShowStatusFilter(!showStatusFilter)}
          style={styles.iconButton}
          activeOpacity={0.6}
        >
          {/* MENGGUNAKAN IKON FEATHER */}
          <Feather
            name={showStatusFilter ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {showStatusFilter && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {['Semua', 'Aman', 'Waspada', 'Bahaya'].map(status => (
            <Pressable
              key={status}
              style={[
                styles.filterChip,
                statusFilter === status && styles.filterChipActive,
                statusFilter === status &&
                  status === 'Aman' && { backgroundColor: '#10B981' },
                statusFilter === status &&
                  status === 'Waspada' && { backgroundColor: '#F59E0B' },
                statusFilter === status &&
                  status === 'Bahaya' && { backgroundColor: '#E11D48' },
              ]}
              onPress={() => {
                setStatusFilter(status as StatusFilter);
                setShowStatusFilter(false);
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === status && styles.filterTextActive,
                ]}
              >
                {status}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );

  /* ================= RENDER ================= */

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1A73E8" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <DisasterListItem
                item={item}
                onPress={() =>
                  navigation.navigate('DetailBencana', { id: item.id })
                }
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Text style={{ color: '#9CA3AF' }}>
                Tidak ada laporan dengan filter tersebut.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{ margin: 20 }} color="#1A73E8" />
            ) : (
              <View style={{ height: 40 }} />
            )
          }
        />
      )}
    </View>
  );
};

export default DashboardBencanaScreen;
