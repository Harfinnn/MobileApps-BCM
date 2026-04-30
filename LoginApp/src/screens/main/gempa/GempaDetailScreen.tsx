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
import {
  TrendingUp,
  Waves,
  MapPin,
  Clock,
  Navigation,
  AlertTriangle,
  Map as MapIcon,
  ChevronDown,
  Share2,
} from 'lucide-react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../../styles/bencana/gempaDetailStyle';
import API from '../../../services/api';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { getUnitsInRadius, UnitWithDistance } from '../../../utils/gempa';
import { generateMapHTML } from '../../../utils/maps/generateMapHtml';
import ViewShot from 'react-native-view-shot';
import RNShare from 'react-native-share';

const GempaDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const { gempa } = route.params;
  const navigation = useNavigation<any>();

  // Auth & Layout Context
  const { user } = useUser();
  const { setTitle, setHideNavbar, setHideHeader, setShowBack, setShowSearch } =
    useLayout();

  // Logic: Cek apakah user adalah Super Admin (ID = 1)
  const isSuperAdmin = user?.jabatan?.jab_id === 1;
  // Ekstraksi Latitude & Longitude dari object gempa
  const coords = gempa?.Coordinates?.split(',') || [];
  const latitude = coords[0] ? parseFloat(coords[0]) : null;
  const longitude = coords[1] ? parseFloat(coords[1]) : null;

  // State & Ref untuk Peta
  const webviewRef = useRef<WebView>(null);
  const mapShotRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // States
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [affectedUnits, setAffectedUnits] = useState<UnitWithDistance[]>([]);
  const [unitStatus, setUnitStatus] = useState<any[]>([]);
  const [showRadius, setShowRadius] = useState(false);
  const [radiusKm, setRadiusKm] = useState(50);
  const [radiusRules, setRadiusRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [impactLoading, setImpactLoading] = useState(false);

  // State untuk Filter Status
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'reported' | 'pending'
  >('all');

  const rotateAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    loadData();
  }, [gempa, isSuperAdmin]);

  useEffect(() => {
    if (isMapReady && latitude && longitude && webviewRef.current) {
      if (!isNaN(latitude) && !isNaN(longitude)) {
        const script = `
          document.dispatchEvent(new MessageEvent('message', {
            data: JSON.stringify({
              type: 'SET_EPICENTER',
              payload: { lat: ${latitude}, lng: ${longitude} }
            })
          }));
        `;
        webviewRef.current.injectJavaScript(script);
      }
    }
  }, [isMapReady, latitude, longitude]);

  useEffect(() => {
    if (isMapReady && affectedUnits.length > 0 && webviewRef.current) {
      const script = `
        document.dispatchEvent(new MessageEvent('message', {
          data: JSON.stringify({
            type: 'ADD_MARKERS',
            payload: ${JSON.stringify(affectedUnits)}
          })
        }));
      `;
      webviewRef.current.injectJavaScript(script);
    }
  }, [isMapReady, affectedUnits]);

  useEffect(() => {
    if (isMapReady && latitude && longitude && radiusKm && webviewRef.current) {
      const cleanLat = parseFloat(latitude.toString());
      const cleanLng = parseFloat(longitude.toString());

      const script = `
        document.dispatchEvent(new MessageEvent('message', {
          data: JSON.stringify({
            type: 'SET_RADIUS',
            payload: {
              lat: ${cleanLat},
              lng: ${cleanLng},
              radius: ${radiusKm * 1000}
            }
          })
        }));
      `;

      webviewRef.current.injectJavaScript(script);
    }
  }, [isMapReady, latitude, longitude, radiusKm]);

  useEffect(() => {
    if (isMapReady && webviewRef.current) {
      const script = `
        document.dispatchEvent(new MessageEvent('message', {
          data: JSON.stringify({
            type: 'SET_MARKER_COLOR',
            payload: { color: '#10B981' } // HIJAU
          })
        }));
      `;

      webviewRef.current.injectJavaScript(script);
    }
  }, [isMapReady]);

  useEffect(() => {
    if (isMapReady && webviewRef.current) {
      const script = `
        document.dispatchEvent(new MessageEvent('message', {
          data: JSON.stringify({
            type: 'SET_CLUSTER_MODE',
            payload: { enabled: false } // ❌ MATIKAN CLUSTER
          })
        }));
      `;

      webviewRef.current.injectJavaScript(script);
    }
  }, [isMapReady]);

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

  const onMapMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MAP_READY') {
        setIsMapReady(true);
      }
    } catch (e) {
      console.error('Map message error:', e);
    }
  };

  const handleShare = async () => {
    try {
      // 1. Kondisi untuk status 'Dirasakan'
      const dirasakanText = gempa.Dirasakan
        ? `\n🌐 Dirasakan   : ${gempa.Dirasakan}`
        : '';

      // 2. Kondisi untuk status 'Potensi Tsunami'
      const potensiTsunamiText = gempa.Potensi
        ? `\n🌊 Potensi     : *${gempa.Potensi}*`
        : '';

      // 3. Tambahan Radius pada blok parameter utama
      const radiusText = `\n⭕ Radius      : ${radiusKm} km`;

      // 4. Daftar Unit Terdekat (Hanya muncul jika ada unit terdampak)
      const unitListText =
        affectedUnits.length > 0
          ? `\n\n🏢 *Unit Terdekat (Dalam Radius ${radiusKm} km):*\n${affectedUnits
              .slice(0, 5)
              .map((u, i) => `• ${u.mjs_nama} (${u.distance.toFixed(1)} km)`)
              .join('\n')}${
              affectedUnits.length > 5 ? '\n• ...dan lainnya' : ''
            }`
          : '';

      // 5. Template Pesan Final
      const message = `Assalamualaikum Warahmatullahi Wabarakaatuh,

🚨 *INFORMASI GEMPABUMI TERKINI* 🚨

📊 Magnitudo   : ${gempa.Magnitude}
📏 Kedalaman   : ${gempa.Kedalaman}
🕒 Waktu       : ${gempa.Tanggal}, ${gempa.Jam}
📌 Pusat Gempa : ${gempa.Wilayah}
📍 Koordinat   : ${latitude}, ${longitude}${radiusText}${potensiTsunamiText}${dirasakanText}${unitListText}

⚠️ * Tindakan Penting yang Harus Segera Dilakukan:*

*1. Tetap tenang dan waspada*
Jangan terpengaruh informasi yang belum pasti. Pastikan hanya mengikuti update resmi dari BMKG.

*2. Lindungi diri saat gempa terjadi*
Segera berlindung di bawah meja atau dekat struktur yang kuat. Setelah gempa berhenti, lakukan evakuasi menuju titik kumpul terbuka sesuai prosedur.

*3. Antisipasi gempa susulan*
Tetap siaga terhadap kemungkinan gempa susulan.

*4. Aktifkan prosedur komunikasi darurat (Call Tree)*
Segera laporkan kondisi diri, keluarga, dan aset Bank Syariah Indonesia melalui jalur yang telah ditentukan.

Keselamatan adalah prioritas. Kesiapan adalah kunci. Kami mengimbau seluruh pegawai untuk tetap tenang, sigap, dan mengikuti prosedur yang berlaku dengan disiplin.

BCM.... Siap..... Siaga.....

----------------------------------------
Demikian informasi yang kami sampaikan.
Business Continuity Management

*Source:* BCM24`;

      if (mapShotRef.current && webviewRef.current) {
        // Sembunyikan kontrol peta sebelum screenshot
        webviewRef.current.injectJavaScript(`
        var controls = document.querySelector('.leaflet-control-container');
        if(controls) controls.style.display = 'none';
        true;
      `);

        // Jeda 500ms agar elemen DOM WebView benar-benar hilang sebelum direkam
        await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

        const uri = await mapShotRef.current.capture();

        // Kembalikan kontrol peta setelah screenshot selesai
        webviewRef.current.injectJavaScript(`
        var controls = document.querySelector('.leaflet-control-container');
        if(controls) controls.style.display = '';
        true;
      `);

        // Buka menu share bawaan perangkat
        await RNShare.open({
          message: message.trim(),
          url: uri,
          title: 'Bagikan Info Gempa',
        });
      }
    } catch (e: any) {
      if (e.message !== 'User did not share') {
        console.error('Share error:', e);
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top + 20,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E11D48']}
          />
        }
      >
        {/* HEADER MAGNITUDE */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Gempa Terkini</Text>
          <Text style={styles.updateText}>
            Gempa utama terbaru menurut BMKG
          </Text>
        </View>

        {/* MAIN CARD */}
        {gempa && (
          <View style={styles.shadowWrapper}>
            {/* 1. PETA GUNCANGAN (HERO HEADER) */}
            {/* PETA GUNCANGAN (LEAFLET) */}
            <View style={styles.mapSection}>
              {latitude && longitude ? (
                <View style={styles.mapWrapper}>
                  <ViewShot
                    ref={mapShotRef}
                    options={{ format: 'jpg', quality: 0.9 }}
                    style={{ flex: 1, backgroundColor: '#E2E8F0' }} // Beri warna background agar jika telat render tidak hitam
                  >
                    <WebView
                      ref={webviewRef}
                      source={{
                        html: generateMapHTML({ showZoomControl: true }),
                      }}
                      onMessage={onMapMessage}
                      style={{ flex: 1, backgroundColor: 'transparent' }}
                      originWhitelist={['*']}
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                    />
                  </ViewShot>
                  <View style={{ position: 'absolute', top: 10, right: 10 }}>
                    <TouchableOpacity
                      onPress={handleShare}
                      activeOpacity={0.8}
                      style={styles.shareButton}
                    >
                      <Share2 size={18} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={[styles.mapWrapper, styles.mapPlaceholder]}>
                  <MapIcon
                    size={32}
                    color="#CBD5E1"
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={{ color: '#94A3B8', fontWeight: '500' }}>
                    Peta tidak tersedia
                  </Text>
                </View>
              )}
            </View>

            {/* 2. QUICK STATS ROW (3 Kolom) */}
            <View style={styles.statsGrid}>
              <View style={styles.statColumn}>
                <View
                  style={[
                    styles.statIconWrapper,
                    { backgroundColor: '#EFF6FF' },
                  ]}
                >
                  <TrendingUp size={20} color="#3B82F6" />
                </View>
                <View style={styles.statValueRow}>
                  <Text style={styles.statValue}>{gempa.Magnitude}</Text>
                </View>
                <Text style={styles.statLabel}>Magnitudo</Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.statColumn}>
                <View
                  style={[
                    styles.statIconWrapper,
                    { backgroundColor: '#ECFEFF' },
                  ]}
                >
                  <Waves size={20} color="#06B6D4" />
                </View>
                <View style={styles.statValueRow}>
                  <Text style={styles.statValue}>
                    {gempa.Kedalaman?.replace(' km', '')}
                  </Text>
                  <Text style={styles.statUnit}> km</Text>
                </View>
                <Text style={styles.statLabel}>Kedalaman</Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.statColumn}>
                <View
                  style={[
                    styles.statIconWrapper,
                    { backgroundColor: '#F0FDF4' },
                  ]}
                >
                  <MapPin size={20} color="#10B981" />
                </View>
                <View style={styles.statValueRow}>
                  <Text style={styles.statValueSmall}>{latitude}</Text>
                </View>
                <Text style={styles.statValueSmall}>{longitude}</Text>
              </View>
            </View>

            <View style={styles.horizontalDivider} />

            {/* 4. DETAIL LIST */}
            <View style={styles.detailsContainer}>
              {/* Waktu */}
              <View style={styles.detailListRow}>
                <View style={styles.iconCircle}>
                  <Clock size={18} color="#64748B" />
                </View>
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailListLabel}>Waktu</Text>
                  <Text style={styles.detailListValue}>
                    {gempa.Tanggal}, {gempa.Jam}
                  </Text>
                </View>
              </View>

              {/* Lokasi */}
              <View style={styles.detailListRow}>
                <View style={styles.iconCircle}>
                  <Navigation size={18} color="#64748B" />
                </View>
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailListLabel}>Lokasi Gempa</Text>
                  <Text style={styles.detailListValue}>{gempa.Wilayah}</Text>
                </View>
              </View>

              {/* Dirasakan */}
              {gempa.Dirasakan && (
                <View
                  style={[
                    styles.detailListRow,
                    { borderBottomWidth: 0, marginBottom: 0 },
                  ]}
                >
                  <View
                    style={[styles.iconCircle, { backgroundColor: '#FEF2F2' }]}
                  >
                    <AlertTriangle size={18} color="#EF4444" />
                  </View>
                  <View style={styles.detailTextWrapper}>
                    <Text style={styles.detailListLabel}>
                      Wilayah Dirasakan (Skala MMI)
                    </Text>
                    <Text
                      style={[styles.detailListValue, { color: '#991B1B' }]}
                    >
                      {gempa.Dirasakan}
                    </Text>
                  </View>
                </View>
              )}
              {/* ANALISIS DAMPAK UNIT - Bagian Header & Filter */}
              <View style={{ marginTop: 40 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
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
                              outputRange: ['0deg', '180deg'], // Memutar panah ke atas
                            }),
                          },
                        ],
                      }}
                    >
                      {/* Menggunakan Lucide Chevron */}
                      <ChevronDown size={24} color="#64748B" />
                    </Animated.View>
                  </TouchableOpacity>
                </View>

                {impactLoading ? (
                  <ActivityIndicator
                    color="#0F172A"
                    style={{ marginTop: 20 }}
                  />
                ) : (
                  showRadius && (
                    <View>
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
                                filterStatus === 'all' &&
                                  styles.filterChipActive,
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
                                Terlapor ({unitStats.reported})
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[
                                styles.filterChip,
                                filterStatus === 'pending' &&
                                  styles.filterChipActive,
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
                                Pending ({unitStats.pending})
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
                            (statusData?.reported_count ?? 0) > 0;

                          return (
                            <View key={index} style={styles.unitCard}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <View style={{ flex: 1 }}>
                                  <Text style={styles.unitName}>
                                    {unit.mjs_nama}
                                  </Text>
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
                                          color: isReported
                                            ? '#10B981'
                                            : '#E11D48',
                                        }}
                                      >
                                        {isReported
                                          ? '✅ TERLAPOR'
                                          : '⏳ PENDING'}
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
                              <View
                                style={[
                                  styles.distanceTrack,
                                  { marginTop: 12 },
                                ]}
                              >
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
            </View>
          </View>
        )}
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
    </SafeAreaView>
  );
};

export default GempaDetailScreen;
