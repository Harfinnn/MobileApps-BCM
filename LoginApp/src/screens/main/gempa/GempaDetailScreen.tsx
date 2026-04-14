import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  BackHandler,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import styles from '../../../styles/bencana/gempaDetailStyle';
import API from '../../../services/api';
import { getUnitsInRadius, UnitWithDistance } from '../../../utils/gempa';

const GempaDetailScreen = () => {
  const route = useRoute<any>();
  const { gempa } = route.params;
  const navigation = useNavigation<any>();

  // Auth & Layout Context
  const { user } = useUser();
  const { setTitle, setHideNavbar, setHideHeader, setShowBack, setShowSearch } =
    useLayout();

  // Logic: Cek apakah user adalah Super Admin (ID = 1)
  const isSuperAdmin = user?.jabatan?.jab_id === 1;

  // States
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [affectedUnits, setAffectedUnits] = useState<UnitWithDistance[]>([]);
  const [unitStatus, setUnitStatus] = useState<any[]>([]);
  const [showRadius, setShowRadius] = useState(false);
  const [radiusKm, setRadiusKm] = useState(50);
  const [radiusRules, setRadiusRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State untuk Filter Status
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'reported' | 'pending'
  >('all');

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const calculateRadius = (magnitude: number, rules: any[]) => {
    if (!rules || rules.length === 0) return 50;
    const mag = Number(magnitude);
    if (mag >= 4 && mag <= 4.9)
      return (
        rules.find((r: any) => r.vig_keterangan.includes('4'))?.vig_radius || 50
      );
    if (mag >= 5 && mag <= 5.9)
      return (
        rules.find((r: any) => r.vig_keterangan.includes('5'))?.vig_radius ||
        100
      );
    if (mag >= 6 && mag <= 6.9)
      return (
        rules.find((r: any) => r.vig_keterangan.includes('6'))?.vig_radius ||
        150
      );
    if (mag >= 7)
      return (
        rules.find((r: any) => r.vig_keterangan.includes('>'))?.vig_radius ||
        200
      );
    return 50;
  };

  useEffect(() => {
    if (Platform.OS === 'android')
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    setTitle('Detail Gempa');
    setHideNavbar(true);
    setHideHeader(true);

    return () => {
      setShowSearch(true);
      setHideNavbar(false);
      setShowBack(true);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('Main', { screen: 'InfoGempaBumi' });
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  // --- FUNGSI LOAD DATA ---
  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setFilterStatus('all'); // Reset filter setiap refresh

      // 1. Ambil Aturan Radius
      let currentRules = radiusRules;
      if (radiusRules.length === 0) {
        const resRadius = await API.get('/gempa-radius');
        if (resRadius.data?.success) {
          currentRules = resRadius.data.data;
          setRadiusRules(currentRules);
        }
      }

      // 2. Ambil Data Lokasi Unit
      const resUnits = await API.get('/selindo', {
        params: { with_location: true },
      });

      if (resUnits.data?.success && gempa?.Coordinates) {
        const [lat, lng] = gempa.Coordinates.split(',').map(Number);
        const radius = calculateRadius(gempa.Magnitude, currentRules);
        setRadiusKm(radius);

        const impacted = getUnitsInRadius(lat, lng, resUnits.data.data, radius);
        setAffectedUnits(impacted);

        // 3. HANYA AMBIL STATUS JIKA USER ADALAH SUPER ADMIN
        if (isSuperAdmin) {
          const gempaRef = `${gempa.Tanggal}-${gempa.Jam}`;
          try {
            const resStatus = await API.get(`/gempa/${gempaRef}/unit-status`);
            if (resStatus.data?.success) {
              setUnitStatus(resStatus.data.data);
            }
          } catch (e: any) {
            console.error('❌ Gagal ambil unit-status:', e.message);
          }
        }
      }
    } catch (err) {
      console.error('Gagal memuat analisis dampak:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [gempa, isSuperAdmin]);

  const onRefresh = () => {
    loadData(true);
  };

  const toggleRadius = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const toValue = showRadius ? 0 : 1;
    Animated.timing(rotateAnim, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setShowRadius(!showRadius);
  };

  const getImpactLevel = (distance: number) => {
    if (distance < 20) return { label: 'RISIKO TINGGI', color: '#E11D48' };
    if (distance < 50) return { label: 'WASPADA', color: '#F59E0B' };
    return { label: 'AMAN', color: '#10B981' };
  };

  // --- LOGIKA FILTER UNIT ---
  const unitStats = useMemo(() => {
    let reported = 0;
    let pending = 0;
    const filtered: UnitWithDistance[] = [];

    affectedUnits.forEach(unit => {
      const statusData = unitStatus.find(s => s.mjs_id == unit.mjs_id);
      const isReported =
        statusData?.status === 'reported' || statusData?.reported_count > 0;

      if (isReported) reported++;
      else pending++;

      // Tentukan apakah unit ini lolos filter saat ini
      if (filterStatus === 'all') {
        filtered.push(unit);
      } else if (filterStatus === 'reported' && isReported) {
        filtered.push(unit);
      } else if (filterStatus === 'pending' && !isReported) {
        filtered.push(unit);
      }
    });

    return {
      total: affectedUnits.length,
      reported,
      pending,
      filteredUnits: filtered,
    };
  }, [affectedUnits, unitStatus, filterStatus]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E11D48']}
          />
        }
      >
        {/* HEADER MAGNITUDE */}
        <View style={styles.topSection}>
          <Text style={styles.dateHeader}>
            {gempa.Tanggal} • {gempa.Jam}
          </Text>
          <View style={styles.magRow}>
            <Text
              style={[
                styles.magNumber,
                { color: Number(gempa.Magnitude) >= 5 ? '#E11D48' : '#0F172A' },
              ]}
            >
              {gempa.Magnitude}
            </Text>
            <Text style={styles.srText}>Magnitude</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <View style={styles.divider} />
          <Text style={styles.wilayahText}>{gempa.Wilayah}</Text>
          <View style={styles.potensiBadge}>
            <Text style={styles.potensiText}>
              {gempa.Potensi || 'Tidak Berpotensi Tsunami'}
            </Text>
          </View>
        </View>

        {/* SHAKEMAP */}
        {gempa.Shakemap && (
          <View style={{ paddingHorizontal: 24, marginBottom: 30 }}>
            <TouchableOpacity
              style={styles.mapTrigger}
              onPress={() => setIsMapVisible(true)}
            >
              <Text style={styles.mapTriggerIcon}>🗺️</Text>
              <View>
                <Text style={styles.mapTriggerTitle}>Buka Peta Guncangan</Text>
                <Text style={styles.mapTriggerSub}>
                  Lihat persebaran dampak (ShakeMap)
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* DATA GRID */}
        <View style={styles.dataGrid}>
          <View style={styles.dataRow}>
            <View style={styles.dataItem}>
              <Text style={styles.label}>KEDALAMAN</Text>
              <Text style={styles.value}>{gempa.Kedalaman}</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.label}>KOORDINAT</Text>
              <Text style={styles.value}>{gempa.Coordinates}</Text>
            </View>
          </View>
          <View style={styles.fullDataItem}>
            <Text style={styles.label}>WILAYAH DIRASAKAN (MMI)</Text>
            <Text style={styles.mmiValue}>
              {gempa.Dirasakan || 'Data tidak dilaporkan'}
            </Text>
          </View>
        </View>

        {/* ANALISIS DAMPAK UNIT */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            <View>
              <Text style={styles.sectionLabel}>ANALISIS DAMPAK</Text>
              <Text style={styles.sectionTitle}>
                Unit Terdekat ({radiusKm}km)
              </Text>
            </View>
            <TouchableOpacity
              onPress={toggleRadius}
              style={styles.expandButton}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '90deg'],
                      }),
                    },
                  ],
                }}
              >
                <Text style={{ fontSize: 20 }}>{showRadius ? '✕' : '❯'}</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color="#0F172A" style={{ marginTop: 20 }} />
          ) : (
            showRadius && (
              <View>
                {/* FILTER CHIPS (Hanya muncul jika Super Admin dan ada unit) */}
                {isSuperAdmin && affectedUnits.length > 0 && (
                  <View style={styles.filterWrapper}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filterScroll}
                    >
                      <TouchableOpacity
                        style={[
                          styles.filterChip,
                          filterStatus === 'all' && styles.filterChipActive,
                        ]}
                        onPress={() => setFilterStatus('all')}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            filterStatus === 'all' &&
                              styles.filterChipTextActive,
                          ]}
                        >
                          Semua ({unitStats.total})
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.filterChip,
                          filterStatus === 'reported' &&
                            styles.filterChipActive,
                        ]}
                        onPress={() => setFilterStatus('reported')}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            filterStatus === 'reported' &&
                              styles.filterChipTextActive,
                          ]}
                        >
                          ✅ Terlapor ({unitStats.reported})
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.filterChip,
                          filterStatus === 'pending' && styles.filterChipActive,
                        ]}
                        onPress={() => setFilterStatus('pending')}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            filterStatus === 'pending' &&
                              styles.filterChipTextActive,
                          ]}
                        >
                          ⏳ Pending ({unitStats.pending})
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                )}

                {/* LIST UNIT YANG SUDAH DIFILTER */}
                {affectedUnits.length === 0 ? (
                  <Text style={styles.emptyStateTextMsg}>
                    Tidak ditemukan unit dalam radius {radiusKm} km
                  </Text>
                ) : unitStats.filteredUnits.length === 0 ? (
                  <Text style={styles.emptyStateTextMsg}>
                    Tidak ada unit dengan status tersebut.
                  </Text>
                ) : (
                  unitStats.filteredUnits.map((unit, index) => {
                    const statusData = unitStatus.find(
                      s => s.mjs_id == unit.mjs_id,
                    );
                    const impact = getImpactLevel(unit.distance);
                    const isReported =
                      statusData?.status === 'reported' ||
                      statusData?.reported_count > 0;

                    return (
                      <View key={index} style={styles.unitCard}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={styles.unitName}>{unit.mjs_nama}</Text>
                            <Text
                              style={{
                                color: impact.color,
                                fontSize: 11,
                                fontWeight: '800',
                                marginTop: 4,
                              }}
                            >
                              ● {impact.label}
                            </Text>
                          </View>

                          {/* KOLOM STATUS: HANYA UNTUK SUPER ADMIN */}
                          <View style={{ alignItems: 'flex-end' }}>
                            {isSuperAdmin ? (
                              <>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: '700',
                                    color: isReported ? '#10B981' : '#E11D48',
                                  }}
                                >
                                  {isReported ? '✅ TERLAPOR' : '⏳ PENDING'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: '#000000',
                                    fontWeight: '500',
                                  }}
                                >
                                  {statusData?.reported_count || 0}/
                                  {statusData?.total_user || 0} User
                                </Text>
                              </>
                            ) : (
                              <Text
                                style={{
                                  fontSize: 11,
                                  color: '#94A3B8',
                                  fontStyle: 'italic',
                                }}
                              >
                                Lokasi Terpantau
                              </Text>
                            )}
                          </View>
                        </View>

                        {/* Distance Visualizer */}
                        <View style={[styles.distanceTrack, { marginTop: 12 }]}>
                          <View
                            style={[
                              styles.distanceFill,
                              {
                                width: `${Math.max(
                                  10,
                                  100 - (unit.distance / radiusKm) * 100,
                                )}%`,
                                backgroundColor: impact.color,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.distanceText}>
                          {unit.distance.toFixed(1)} km dari episenter
                        </Text>
                      </View>
                    );
                  })
                )}
              </View>
            )
          )}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() =>
            navigation.navigate('Main', { screen: 'InfoGempaBumi' })
          }
        >
          <Text style={styles.closeButtonText}>Kembali ke Daftar</Text>
        </TouchableOpacity>
      </View>

      {/* SHAKEMAP MODAL */}
      <Modal visible={isMapVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsMapVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>Tutup Peta</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <ScrollView
            maximumZoomScale={4}
            minimumZoomScale={1}
            centerContent
            contentContainerStyle={styles.modalScroll}
          >
            <Image
              source={{
                uri: `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`,
              }}
              style={styles.fullMapImage}
              resizeMode="contain"
            />
          </ScrollView>
          <View style={styles.modalFooter}>
            <Text style={styles.zoomHint}>Gunakan dua jari untuk zoom</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GempaDetailScreen;
