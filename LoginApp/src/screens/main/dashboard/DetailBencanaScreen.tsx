import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  Modal,
  Platform,
  Linking,
  StatusBar,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Animated,
  Clipboard,
  ToastAndroid,
  Alert,
} from 'react-native';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';

import API from '../../../services/api';
import { useLayout } from '../../../contexts/LayoutContext';
import { resolveImageUri } from '../../../utils/image';
import styles from '../../../styles/bencana/detailBencanaStyle';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const DetailBencanaScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const id = route.params?.id;

  const { setTitle, setShowBack, setHideNavbar, setOnBack } = useLayout();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);

  // State Accordion
  const [showGempaDetail, setShowGempaDetail] = useState(false);
  const [showFoto, setShowFoto] = useState(false);

  // Ref Animasi
  const gempaRotation = useRef(new Animated.Value(0)).current;
  const fotoRotation = useRef(new Animated.Value(0)).current;
  const gempaHeight = useRef(new Animated.Value(0)).current;
  const fotoHeight = useRef(new Animated.Value(0)).current;

  // Interpolasi Rotasi Panah
  const gempaArrowSpin = gempaRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const fotoArrowSpin = fotoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Konfigurasi LayoutAnimation (Opsi 2)
  const layoutAnimConfig = LayoutAnimation.Presets.easeInEaseOut;

  const toggleGempaDetail = () => {
    // Memicu transisi layout agar komponen di bawahnya bergeser mulus
    LayoutAnimation.configureNext(layoutAnimConfig);

    const next = !showGempaDetail;
    setShowGempaDetail(next);

    Animated.parallel([
      Animated.timing(gempaRotation, {
        toValue: next ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(gempaHeight, {
        toValue: next ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const toggleFoto = () => {
    LayoutAnimation.configureNext(layoutAnimConfig);

    const next = !showFoto;
    setShowFoto(next);

    Animated.parallel([
      Animated.timing(fotoRotation, {
        toValue: next ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fotoHeight, {
        toValue: next ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    Clipboard.setString(text);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Nomor HP disalin ke clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Disalin', 'Nomor HP berhasil disalin');
    }
  };

  const coordinate = useMemo(() => {
    if (!data?.lokasi) return null;
    const [lat, lng] = data.lokasi.split(',').map(Number);
    return isNaN(lat) || isNaN(lng) ? null : { latitude: lat, longitude: lng };
  }, [data?.lokasi]);

  const openMaps = () => {
    if (!coordinate) return;
    const { latitude, longitude } = coordinate;
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  const openWhatsApp = (phone: string) => {
    if (!phone) return;

    let cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = '62' + cleanedPhone.slice(1);
    }

    // Gunakan link HTTPS agar lebih universal
    const url = `https://wa.me/${cleanedPhone}`;

    // Langsung panggil openURL tanpa canOpenURL untuk menghindari isu query di Android 11+
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Pastikan WhatsApp terinstal di perangkat Anda');
    });
  };

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('DashboardBencana');
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  useEffect(() => {
    setTitle('Detail Laporan');
    setHideNavbar(true);
    setShowBack(true);
    setOnBack(() => () => {
      navigation.navigate('DashboardBencana');
      return true;
    });
    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [navigation, setTitle, setHideNavbar, setShowBack, setOnBack]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/dashboard/bencana/${id}`);
        if (res.data.success) setData(res.data.data);
      } catch (e) {
        console.log('Error fetch detail', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );

  if (!data) return null;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* MAP SECTION */}
        <View style={styles.mapWrapper}>
          {coordinate && (
            <WebView
              originWhitelist={['*']}
              scrollEnabled={false}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta name="viewport" content="initial-scale=1.0">
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
                    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                    <style>html, body, #map { height: 100%; margin: 0; background: #EEE; }</style>
                  </head>
                  <body>
                    <div id="map"></div>
                    <script>
                      const map = L.map('map', { zoomControl: false, attributionControl: false })
                        .setView([${coordinate.latitude}, ${coordinate.longitude}], 15);
                      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
                      L.marker([${coordinate.latitude}, ${coordinate.longitude}]).addTo(map);
                    </script>
                  </body>
                  </html>
                `,
              }}
              style={styles.map}
            />
          )}
          <TouchableOpacity style={styles.openMapBtn} onPress={openMaps}>
            <Text style={styles.openMapText}>Buka di Maps</Text>
          </TouchableOpacity>
        </View>

        {/* INFO CARD */}
        <View style={styles.infoCard}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: data.ada_kerusakan ? '#FEE2E2' : '#E0F2FE' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: data.ada_kerusakan ? '#B91C1C' : '#0369A1' },
              ]}
            >
              {data.ada_kerusakan ? 'KERUSAKAN' : 'TERDAMPAK'}
            </Text>
          </View>

          <Text style={styles.title}>{data.jenis_bencana}</Text>
          <Text style={styles.unitText}>{data.unit_kerja}</Text>

          {/* META INFO */}
          {/* GANTI META INFO ROW LAMA DENGAN INI */}
          <View style={styles.reportInfoContainer}>
            <View style={styles.infoRowDetailed}>
              <View style={styles.infoIconWrapper}>
                <Icon name="person" size={18} color="#3B82F6" />
              </View>
              <View style={styles.infoTextColumn}>
                <Text style={styles.infoLabel}>Nama Pelapor</Text>
                <Text style={styles.infoMainText}>{data.pelapor || '-'}</Text>
              </View>
            </View>

            <View style={styles.infoRowDetailed}>
              <View style={styles.infoIconWrapper}>
                <Icon name="calendar" size={18} color="#6366F1" />
              </View>
              <View style={styles.infoTextColumn}>
                <Text style={styles.infoLabel}>Waktu Kejadian</Text>
                <Text style={styles.infoMainText}>
                  {data.created_at || '-'}
                </Text>
              </View>
            </View>

            {data.no_hp && (
              <TouchableOpacity
                style={[styles.infoRowDetailed, styles.phoneClickable]}
                // Klik sekali langsung buka WhatsApp
                onPress={() => openWhatsApp(data.no_hp)}
                // Tekan lama untuk salin (fitur tambahan yang berguna)
                onLongPress={() => copyToClipboard(data.no_hp)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.infoIconWrapper,
                    { backgroundColor: '#DCF8C6' },
                  ]}
                >
                  <Icon name="logo-whatsapp" size={18} color="#075E54" />
                </View>
                <View style={styles.infoTextColumn}>
                  <Text style={[styles.infoLabel, { color: '#075E54' }]}>
                    Hubungi via WhatsApp (Klik)
                  </Text>
                  <Text style={[styles.infoMainText, { color: '#25D366' }]}>
                    {data.no_hp}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#94A3B8' }}>
                    Tahan untuk salin nomor
                  </Text>
                </View>
                <Icon
                  name="chevron-forward-outline"
                  size={18}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider} />

          {/* LOKASI PELAPOR */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lokasi Pelapor</Text>
            <Text style={styles.sectionValue}>{data.lokasi || '-'}</Text>
          </View>

          {/* COLLAPSIBLE GEMPA */}
          {data.jenis_bencana?.toLowerCase().includes('gempa') && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.accordionHeader}
                activeOpacity={0.7}
                onPress={toggleGempaDetail}
              >
                <Text style={styles.sectionTitle}>Informasi Sumber Gempa</Text>
                <Animated.View
                  style={{ transform: [{ rotate: gempaArrowSpin }] }}
                >
                  <Icon name="chevron-down" size={20} color="#6B7280" />
                </Animated.View>
              </TouchableOpacity>

              <Animated.View
                style={{
                  overflow: 'hidden',
                  opacity: gempaHeight,
                  maxHeight: gempaHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                  }),
                }}
              >
                <View style={styles.gempaInfoCard}>
                  <View style={styles.gempaDataGrid}>
                    <View style={styles.gempaDataItem}>
                      <Text style={styles.gempaDataLabel}>Magnitude</Text>
                      <Text style={styles.gempaDataValue}>
                        {data.magnitude || '-'} SR
                      </Text>
                    </View>
                    <View style={styles.gempaDataDivider} />
                    <View style={styles.gempaDataItem}>
                      <Text style={styles.gempaDataLabel}>Kedalaman</Text>
                      <Text style={styles.gempaDataValue}>
                        {data.kedalaman || '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.gempaLocBox}>
                    <Text style={styles.gempaDataLabel}>Wilayah Pusat</Text>
                    <Text style={styles.gempaLocText}>
                      {data.wilayah_gempa || '-'}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          )}

          {/* KONDISI LAPANGAN */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kondisi Lapangan</Text>
            <View style={styles.conditionGrid}>
              <View
                style={[
                  styles.conditionTile,
                  { backgroundColor: data.terdampak ? '#E0F2FE' : '#F0FDF4' },
                ]}
              >
                <Text style={styles.conditionEmoji}>
                  {data.terdampak ? '⚠️' : '✅'}
                </Text>
                <View>
                  <Text style={styles.conditionLabel}>Status Bencana</Text>
                  <Text
                    style={[
                      styles.conditionStatus,
                      { color: data.terdampak ? '#0369A1' : '#15803D' },
                    ]}
                  >
                    {data.terdampak ? 'Terdampak' : 'Aman'}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.conditionTile,
                  {
                    backgroundColor: data.ada_kerusakan ? '#FEE2E2' : '#F9FAFB',
                  },
                ]}
              >
                <Text style={styles.conditionEmoji}>
                  {data.ada_kerusakan ? '🏚️' : '🛡️'}
                </Text>
                <View>
                  <Text style={styles.conditionLabel}>Kerusakan Gedung</Text>
                  <Text
                    style={[
                      styles.conditionStatus,
                      { color: data.ada_kerusakan ? '#B91C1C' : '#4B5563' },
                    ]}
                  >
                    {data.ada_kerusakan ? 'Ada Kerusakan' : 'Tidak Ada'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* COLLAPSIBLE FOTO */}
          {data.foto && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.accordionHeader}
                activeOpacity={0.7}
                onPress={toggleFoto}
              >
                <Text style={styles.sectionTitle}>Foto Laporan</Text>
                <Animated.View
                  style={{ transform: [{ rotate: fotoArrowSpin }] }}
                >
                  <Icon name="chevron-down" size={20} color="#6B7280" />
                </Animated.View>
              </TouchableOpacity>

              <Animated.View
                style={{
                  overflow: 'hidden',
                  opacity: fotoHeight,
                  maxHeight: fotoHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 400],
                  }),
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setShowImage(true)}
                  style={{ marginTop: 10 }}
                >
                  <Image
                    source={{ uri: resolveImageUri(data.foto) }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* MODAL FULL IMAGE */}
      <Modal visible={showImage} transparent animationType="fade">
        <TouchableOpacity
          style={styles.imageModal}
          onPress={() => setShowImage(false)}
        >
          <Image
            source={{ uri: resolveImageUri(data.foto) }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DetailBencanaScreen;
