import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';
import {
  MapPin,
  Activity,
  AlertTriangle,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import API from '../../../services/api';

// Mengimpor berkas gaya terpisah
import styles from '../../../styles/bencana/tsunamiHistoryStyle';

const TsunamiHistoryScreen = () => {
  const navigation = useNavigation<any>();

  const {
    setTitle,
    setHideNavbar,
    setHideHeader,
    setOnBack,
    setShowSearch,
    setShowBack,
  } = useLayout();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTitle('Riwayat Tsunami');

    setHideNavbar(true);
    setHideHeader(false);
    setShowBack(true);
    setShowSearch(false);

    setOnBack(() => () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
      return true;
    });

    return () => {
      setShowSearch(true);
      setHideNavbar(false);
      setHideHeader(false);
      setOnBack(undefined); // PENTING: Bersihkan listener agar tidak bocor ke halaman selanjutnya
    };
  }, [
    navigation,
    setOnBack,
    setTitle,
    setHideNavbar,
    setHideHeader,
    setShowBack,
    setShowSearch,
  ]);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/tsunami/history');

      if (res.data?.status) {
        const tsunamiData = res.data.data ?? [];
        setData(tsunamiData);
        setTitle(`Riwayat Tsunami (${tsunamiData.length})`);
      }
    } catch (error) {
      console.log('ERROR FETCH TSUNAMI HISTORY', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const renderItem = ({ item, index }: any) => {
    const isActive = Number(item.is_active) === 1;
    const isLatest = index === 0;

    return (
      <Pressable
        onPress={() =>
          navigation.navigate('TsunamiDetail', {
            tsunamiData: item,
          })
        }
        style={({ pressed }) => [
          styles.cardWrapper,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.premiumCard}>
          {/* Card Header Top */}
          <View style={styles.cardHeaderRow}>
            <View style={styles.badgeGroup}>
              {isLatest && (
                <View style={styles.badgeLatest}>
                  <Text style={styles.badgeLatestText}>TERBARU</Text>
                </View>
              )}

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: isActive ? '#FEF2F2' : '#ECFDF5' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: isActive ? '#DC2626' : '#16A34A' },
                  ]}
                >
                  {isActive ? 'AKTIF' : 'BERAKHIR'}
                </Text>
              </View>
            </View>

            <ChevronRight size={16} color="#94A3B8" />
          </View>

          {/* Main Info Row */}
          <View style={styles.mainInfoRow}>
            <View style={styles.statElement}>
              <Text style={styles.statLabelText}>MAGNITUDO</Text>
              <Text style={styles.magnitudeNumber}>
                {item.magnitude || '-'}
              </Text>
            </View>

            <View style={styles.innerVerticalDivider} />

            <View style={styles.statElement}>
              <Text style={styles.statLabelText}>KEDALAMAN</Text>
              <View style={styles.depthValueWrapper}>
                <Activity
                  size={14}
                  color="#64748B"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.depthValueText}>{item.depth || '-'}</Text>
              </View>
            </View>
          </View>

          {/* Location Line */}
          <View style={styles.locationRow}>
            <MapPin size={15} color="#475569" style={styles.locationIcon} />
            <Text numberOfLines={2} style={styles.areaText}>
              {item.area}
            </Text>
          </View>

          {/* Potential Section */}
          {!!item.potential && (
            <View
              style={[
                styles.potentialContainer,
                { backgroundColor: isActive ? '#FFF7ED' : '#F8FAFC' },
              ]}
            >
              <AlertTriangle
                size={14}
                color={isActive ? '#EA580C' : '#64748B'}
                style={{ marginRight: 6, marginTop: 1 }}
              />
              <Text
                style={[
                  styles.potentialText,
                  { color: isActive ? '#C2410C' : '#475569' },
                ]}
              >
                {item.potential}
              </Text>
            </View>
          )}

          {/* Headline Report */}
          {!!item.headline && (
            <Text numberOfLines={2} style={styles.headlineText}>
              {item.headline}
            </Text>
          )}

          {/* Card Footer Timestamp */}
          <View style={styles.cardFooter}>
            <Clock size={12} color="#94A3B8" style={{ marginRight: 5 }} />
            <Text style={styles.footerText}>
              Waktu Siar: {item.timesent || item.created_at}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F172A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Riwayat Tsunami</Text>
        <Text style={styles.headerSubtitle}>
          Data komprehensif riwayat peringatan dini tsunami resmi dari BMKG
          pusat.
        </Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(item.id ?? index)}
        contentContainerStyle={[
          styles.listContent,
          { flexGrow: data.length === 0 ? 1 : undefined },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0F172A']}
            tintColor="#0F172A"
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Tidak ditemukan riwayat data tsunami.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default TsunamiHistoryScreen;
