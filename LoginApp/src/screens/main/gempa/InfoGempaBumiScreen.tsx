import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {
  TrendingUp,
  Waves,
  MapPin,
  Clock,
  Navigation,
  AlertTriangle,
  Map as MapIcon,
  CheckCircle2,
  Hourglass,
  ChevronDown,
  Info,
  Share2,
} from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import API from '../../../services/api';
import { getUnitsInRadius, UnitWithDistance } from '../../../utils/gempa';
import styles from '../../../styles/bencana/infoGempaStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { generateMapHTML } from '../../../utils/maps/generateMapHtml';
import ViewShot from 'react-native-view-shot';
import RNShare from 'react-native-share';

type UnitStatus = {
  mjs_id: number;
  status?: string;
  reported_count?: number;
  total_user?: number;
};

const AUTOGEMPA_URL = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';
const DIRASAKAN_URL =
  'https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json';

const REFRESH_INTERVAL = 2 * 60 * 1000;

const InfoGempaBumiScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user } = useUser();
  const isSuperAdmin = user?.jabatan?.jab_id === 1;
  const webviewRef = useRef<WebView>(null);

  const {
    setTitle,
    setHideNavbar,
    setHideHeader,
    setShowBack,
    setOnBack,
    setShowSearch,
    setHideHeaderLeft,
  } = useLayout();

  const [mainGempa, setMainGempa] = useState<any>(null);
  const [listGempa, setListGempa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [affectedUnits, setAffectedUnits] = useState<UnitWithDistance[]>([]);
  const [unitStatus, setUnitStatus] = useState<UnitStatus[]>([]);
  const [showRadius, setShowRadius] = useState(false);
  const [radiusKm, setRadiusKm] = useState(50);
  const [radiusRules, setRadiusRules] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [impactLoading, setImpactLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mapShotRef = useRef<any>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const latLng = mainGempa?.Coordinates?.split(',') || [];
  const latitude = latLng[0];
  const longitude = latLng[1];

  useEffect(() => {
    if (mainGempa) {
      loadImpact();
    }
  }, [mainGempa, isSuperAdmin]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

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
    setTitle('Info Gempa Bumi');
    setHideNavbar(true);
    setShowBack(true);
    fetchGempa(true);
    setShowSearch(false);
    setHideHeaderLeft(false);
    setHideHeader(false);
    setOnBack(() => () => {
      navigation.navigate('Main', { screen: 'Home' });
      return true;
    });

    intervalRef.current = setInterval(() => {
      fetchGempa(false);
    }, REFRESH_INTERVAL);

    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isMapReady || !webviewRef.current) return;

    const cleanLat = parseFloat(latitude?.toString());
    const cleanLng = parseFloat(longitude?.toString());

    const script = `
    // CONFIG
    document.dispatchEvent(new MessageEvent('message', {
      data: JSON.stringify({
        type: 'SET_CLUSTER_MODE',
        payload: { enabled: false }
      })
    }));

    document.dispatchEvent(new MessageEvent('message', {
      data: JSON.stringify({
        type: 'SET_MARKER_COLOR',
        payload: { color: '#10B981' }
      })
    }));

    // EPICENTER
    ${
      latitude && longitude
        ? `
    document.dispatchEvent(new MessageEvent('message', {
      data: JSON.stringify({
        type: 'SET_EPICENTER',
        payload: { lat: ${cleanLat}, lng: ${cleanLng} }
      })
    }));
    `
        : ''
    }

    // RADIUS
    ${
      radiusKm
        ? `
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
    `
        : ''
    }

    // MARKERS
    ${
      affectedUnits.length > 0
        ? `
    document.dispatchEvent(new MessageEvent('message', {
      data: JSON.stringify({ type: 'RESET_MARKERS' })
    }));

    document.dispatchEvent(new MessageEvent('message', {
      data: JSON.stringify({
        type: 'ADD_MARKERS',
        payload: ${JSON.stringify(affectedUnits)}
      })
    }));
    `
        : ''
    }
  `;

    webviewRef.current.injectJavaScript(script);
  }, [isMapReady, affectedUnits, latitude, longitude, radiusKm]);

  const fetchGempa = async (showLoading: boolean) => {
    try {
      if (showLoading) setLoading(true);

      const timestamp = Date.now();

      const [mainRes, listRes] = await Promise.all([
        fetch(`${AUTOGEMPA_URL}?t=${timestamp}`),
        fetch(`${DIRASAKAN_URL}?t=${timestamp}`),
      ]);

      const mainJson = await mainRes.json();
      const listJson = await listRes.json();

      if (mainJson?.Infogempa?.gempa) {
        setMainGempa(mainJson.Infogempa.gempa);

        // debug opsional
        console.log(
          'LATEST GEMPA:',
          mainJson.Infogempa.gempa.Tanggal,
          mainJson.Infogempa.gempa.Jam,
        );
      }

      if (Array.isArray(listJson?.Infogempa?.gempa)) {
        setListGempa(listJson.Infogempa.gempa);
      }
    } catch (e) {
      console.error('Gagal update gempa', e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const calculateRadius = (magnitude: number, rules: any[]): number => {
    if (!rules || rules.length === 0) return 50;
    const mag = Number(magnitude);

    if (mag >= 4 && mag <= 4.9)
      return rules.find(r => r.vig_keterangan.includes('4'))?.vig_radius || 50;
    if (mag >= 5 && mag <= 5.9)
      return rules.find(r => r.vig_keterangan.includes('5'))?.vig_radius || 100;
    if (mag >= 6 && mag <= 6.9)
      return rules.find(r => r.vig_keterangan.includes('6'))?.vig_radius || 150;
    if (mag >= 7)
      return rules.find(r => r.vig_keterangan.includes('>'))?.vig_radius || 200;

    return 50;
  };

  const loadImpact = async () => {
    try {
      setImpactLoading(true);

      // 🔒 Safety guard
      if (!mainGempa?.Coordinates || !mainGempa?.Magnitude) {
        return;
      }

      let rules = radiusRules;

      // 🔄 Ambil rules jika belum ada
      if (!radiusRules || radiusRules.length === 0) {
        const res = await API.get('/gempa-radius');
        if (res?.data?.success) {
          rules = res.data.data || [];
          setRadiusRules(rules);
        }
      }

      // 📡 Ambil data unit
      const resUnits = await API.get('/selindo', {
        params: { with_location: true },
      });

      if (!resUnits?.data?.success || !Array.isArray(resUnits.data.data)) {
        console.warn('Data unit tidak valid');
        return;
      }

      // 📍 Parsing koordinat (AMAN)
      const coords = mainGempa.Coordinates.split(',');
      if (coords.length !== 2) {
        console.warn('Format koordinat invalid:', mainGempa.Coordinates);
        return;
      }

      const lat = Number(coords[0]);
      const lng = Number(coords[1]);

      if (isNaN(lat) || isNaN(lng)) {
        console.warn('Koordinat bukan angka:', coords);
        return;
      }

      // 📏 Hitung radius
      const radius = calculateRadius(mainGempa.Magnitude, rules);
      setRadiusKm(radius);

      // 🎯 Hitung unit terdampak
      const impacted = getUnitsInRadius(lat, lng, resUnits.data.data, radius);

      setAffectedUnits(impacted || []);

      // 👑 Ambil status (hanya super admin)
      if (isSuperAdmin) {
        try {
          const gempaRef = `${mainGempa.Tanggal}-${mainGempa.Jam}`;
          const resStatus = await API.get(`/gempa/${gempaRef}/unit-status`);

          if (resStatus?.data?.success) {
            setUnitStatus(resStatus.data.data || []);
          } else {
            setUnitStatus([]);
          }
        } catch (e) {
          const errorMessage =
            e instanceof Error ? e.message : JSON.stringify(e);

          console.error('❌ Error:', errorMessage);
        }
      }
    } catch (e) {
      console.error('Gagal load impact:', e);
    } finally {
      setImpactLoading(false);
    }
  };

  const toggleRadius = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.timing(rotateAnim, {
      toValue: showRadius ? 0 : 1,
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
        statusData?.status === 'reported' ||
        (statusData?.reported_count ?? 0) > 0;

      if (isReported) reported++;
      else pending++;

      if (filterStatus === 'all') filtered.push(unit);
      else if (filterStatus === 'reported' && isReported) filtered.push(unit);
      else if (filterStatus === 'pending' && !isReported) filtered.push(unit);
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
      if (data.type === 'MARKER_CLICK') {
        // Logika detail unit
      }
    } catch (e) {
      console.error('Map message error:', e);
    }
  };

  const handleShare = async () => {
    try {
      const impactSummary =
        affectedUnits.length > 0
          ? `\n📊 Dampak:\n- Total: ${unitStats.total}\n- Terlapor: ${unitStats.reported}\n- Pending: ${unitStats.pending}\n- Radius: ${radiusKm} km`
          : '\n📊 Tidak ada unit terdampak.\n';

      const unitList =
        affectedUnits.length > 0
          ? `\n🏢 Unit Terdekat:\n${affectedUnits
              .slice(0, 5)
              .map(
                (u, i) =>
                  `${i + 1}. ${u.mjs_nama} (${u.distance.toFixed(1)} km)`,
              )
              .join('\n')}${affectedUnits.length > 5 ? '\n...dan lainnya' : ''}`
          : '';

      const dirasakanText = mainGempa.Dirasakan
        ? `\n🌐 Dirasakan: ${mainGempa.Dirasakan}`
        : '';

      const message = `📍 *INFO mainGempa TERKINI*

📊 Magnitudo: ${mainGempa.Magnitude}
📏 Kedalaman: ${mainGempa.Kedalaman}
🕒 Waktu: ${mainGempa.Tanggal}, ${mainGempa.Jam}
📌 Lokasi: ${mainGempa.Wilayah}
📍 Koordinat: ${latitude}, ${longitude}${dirasakanText}
${impactSummary}
${unitList}

🔗 Info Resmi BMKG:
https://www.bmkg.go.id/gempabumi/

Tetap waspada dan pastikan informasi dari sumber resmi.`;

      if (mapShotRef.current && webviewRef.current) {
        webviewRef.current.injectJavaScript(`
          var controls = document.querySelector('.leaflet-control-container');
          if(controls) controls.style.display = 'none';
          true;
        `);

        await new Promise<void>(resolve => setTimeout(() => resolve(), 200));

        const uri = await mapShotRef.current.capture();

        webviewRef.current.injectJavaScript(`
          var controls = document.querySelector('.leaflet-control-container');
          if(controls) controls.style.display = '';
          true;
        `);

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

  if (loading && !mainGempa) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Memuat data gempa…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: insets.top + 75,
          paddingBottom: insets.bottom + 40,
        },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Gempa Terkini</Text>
        <Text style={styles.updateText}>Gempa utama terbaru menurut BMKG</Text>
      </View>

      {/* MAIN CARD */}
      {mainGempa && (
        <View style={styles.shadowWrapper}>
          <View style={styles.premiumCard}>
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
                  <View style={styles.shareButtonWrapper}>
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
                  <Text style={styles.statValue}>{mainGempa.Magnitude}</Text>
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
                    {mainGempa.Kedalaman?.replace(' km', '')}
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

            {/* 3. STATUS POTENSI (Pill Button) */}
            <View style={styles.potensiWrapper}>
              <View style={styles.potensiPill}>
                <Info size={14} color="#334155" style={{ marginRight: 6 }} />
                <Text style={styles.potensiText}>{mainGempa.Potensi}</Text>
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
                    {mainGempa.Tanggal}, {mainGempa.Jam}
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
                  <Text style={styles.detailListValue}>
                    {mainGempa.Wilayah}
                  </Text>
                </View>
              </View>

              {/* Dirasakan */}
              {mainGempa.Dirasakan && (
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
                      {mainGempa.Dirasakan}
                    </Text>
                  </View>
                </View>
              )}
              {/* ANALISIS DAMPAK UNIT - Bagian Header & Filter */}
              <View style={{ paddingHorizontal: 24, marginTop: 40 }}>
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
                              <CheckCircle2
                                size={14}
                                color={
                                  filterStatus === 'reported'
                                    ? '#FFF'
                                    : '#10B981'
                                }
                                style={{ marginRight: 6 }}
                              />
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
                              <Hourglass
                                size={14}
                                color={
                                  filterStatus === 'pending'
                                    ? '#FFF'
                                    : '#F59E0B'
                                }
                                style={{ marginRight: 6 }}
                              />
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
        </View>
      )}

      {/* LIST */}
      <Text style={styles.sectionTitle}>Gempa Dirasakan</Text>

      {listGempa.slice(0, 5).map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.listItem}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('GempaDetail', { gempa: item })}
        >
          <View
            style={[
              styles.listMag,
              Number(item.Magnitude) >= 5 ? styles.bgWarning : styles.bgInfo,
            ]}
          >
            <Text style={styles.listMagText}>{item.Magnitude}</Text>
          </View>

          <View style={styles.listContent}>
            <Text style={styles.listLoc} numberOfLines={1}>
              {item.Wilayah}
            </Text>
            <Text style={styles.listTime}>
              {item.Tanggal} • {item.Jam}
            </Text>
            <Text style={styles.listScale}>
              Dirasakan: {item.Dirasakan || '-'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Informasi ini disediakan oleh BMKG
        </Text>
      </View>
    </ScrollView>
  );
};

export default InfoGempaBumiScreen;
