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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

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

type DateFilter = 'today' | 'week' | 'month' | 'all';

const DashboardBencanaScreen = () => {
  const navigation = useNavigation<any>();
  const webViewRef = useRef<WebView>(null);

  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();

  const [summary, setSummary] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');

  /* ================= HELPERS ================= */

  const todayStr = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Jakarta',
  });

  const isSameDay = (dateStr: string) => dateStr?.startsWith(todayStr);

  const isWithinDays = (dateStr: string, days: number) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= days;
  };

  /* ================= API ================= */

  const fetchSummary = async () => {
    try {
      const res = await getDashboardSummary();
      if (res.data.success) setSummary(res.data.data);
    } catch (e) {
      console.log('Gagal ambil summary', e);
    }
  };

  const fetchHistory = async (pageNum = 1, refresh = false) => {
    try {
      const res = await getDashboardHistory({ page: pageNum });
      if (res.data.success) {
        const result = res.data.data;
        setLastPage(result.last_page);
        setData(prev => (refresh ? result.data : [...prev, ...result.data]));
      }
    } catch (e) {
      console.log('Gagal ambil history', e);
    }
  };

  const loadInitial = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchSummary(), fetchHistory(1, true)]);
    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await Promise.all([fetchSummary(), fetchHistory(1, true)]);
    setRefreshing(false);
  }, []);

  const loadMore = async () => {
    if (loading || loadingMore || page >= lastPage) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchHistory(nextPage);
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

    loadInitial();

    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [loadInitial]);

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

          {/* ZOOM CONTROLS */}
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

          <View style={styles.mapBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.mapBadgeText}>Live Hari Ini</Text>
          </View>
        </View>
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.emptyText}>Tidak ada laporan hari ini</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>RINGKASAN LAPORAN</Text>
      <View style={{ paddingHorizontal: 4 }}>
        {summary && <SummaryCards data={summary} />}
      </View>

      <Text style={styles.sectionLabel}>RIWAYAT LAPORAN</Text>
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
          data={data}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <DisasterListItem
                item={item}
                onPress={() =>
                  navigation.navigate('DetailBencana', {
                    id: item.id,
                  })
                }
              />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{ margin: 20 }} />
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
