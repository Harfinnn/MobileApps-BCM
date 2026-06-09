import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';
import { generateMapHTML } from '../../../utils/maps/generateMapHtml';
import {
  AlertTriangle,
  Activity,
  Calendar,
  Clock,
  Bell,
} from 'lucide-react-native';
import WebView from 'react-native-webview';

// Mengimport file styles yang terpisah
import styles from '../../../styles/bencana/tsunamiDetailStyle';

const TsunamiDetailScreen = () => {
  const route = useRoute<any>();
  const tsunamiData = route.params?.tsunamiData;
  const navigation = useNavigation<any>();

  const webviewRef = useRef<WebView>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedMap, setSelectedMap] = useState<
    'epicenter' | 'shakemap' | 'wzmap' | 'ttmap' | 'sshmap'
  >('epicenter');
  const [previewVisible, setPreviewVisible] = useState(false);

  const {
    setTitle,
    setHideNavbar,
    setHideHeader,
    setOnBack,
    setShowSearch,
    setShowBack,
    setHideHeaderLeft,
  } = useLayout();

  const coords = tsunamiData?.coordinates?.split(',') ?? [];
  const longitude = coords.length === 2 ? Number(coords[0]) : null;
  const latitude = coords.length === 2 ? Number(coords[1]) : null;

  const isActive = Number(tsunamiData?.is_active) === 1;

  const affectedAreas =
    tsunamiData?.areas ??
    (tsunamiData?.areas_json ? JSON.parse(tsunamiData.areas_json) : []);

  const mapBaseUrl = 'https://bmkg-content-inatews.storage.googleapis.com/';

  const selectedImage =
    selectedMap === 'shakemap'
      ? tsunamiData?.shakemap
      : selectedMap === 'wzmap'
      ? tsunamiData?.wzmap
      : selectedMap === 'ttmap'
      ? tsunamiData?.ttmap
      : tsunamiData?.sshmap;

  // Handle tombol back fisik Android dengan benar (Pop Stack)
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('Main', { screen: 'TsunamiHistory' });
        }
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  useEffect(() => {
    setTitle('Detail Peringatan');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);
    setHideHeaderLeft(false);
    setHideHeader(false);

    // Set action back custom untuk Header global
    setOnBack(() => () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Main', { screen: 'TsunamiHistory' });
      }
      return true;
    });

    return () => {
      setShowSearch(true);
      setHideNavbar(false);
      setHideHeader(false);
      setShowSearch(false);
      setOnBack(undefined); 
    };
  }, [
    navigation,
    setOnBack,
    setTitle,
    setHideNavbar,
    setShowBack,
    setShowSearch,
    setHideHeaderLeft,
    setHideHeader,
  ]);

  useEffect(() => {
    if (
      !isMapReady ||
      !webviewRef.current ||
      latitude === null ||
      longitude === null
    ) {
      return;
    }

    if (selectedMap !== 'epicenter') {
      return;
    }

    const timer = setTimeout(() => {
      const script = `
      document.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'SET_EPICENTER',
            payload: {
              lat: ${latitude},
              lng: ${longitude}
            }
          })
        })
      );
      true;
    `;

      webviewRef.current?.injectJavaScript(script);
    }, 300);

    return () => clearTimeout(timer);
  }, [isMapReady, latitude, longitude, selectedMap]);

  const getLevelColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'AWAS':
        return { text: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' };
      case 'SIAGA':
        return { text: '#EA580C', bg: '#FFF7ED', border: '#FDBA74' };
      case 'WASPADA':
        return { text: '#CA8A04', bg: '#FEFCE8', border: '#FDE047' };
      default:
        return { text: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' };
    }
  };

  const onMapMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'MAP_READY') {
        setIsMapReady(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* BANNER UTAMA */}
        <View style={styles.premiumBanner}>
          <View style={styles.bannerHeader}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isActive ? '#FEF2F2' : '#ECFDF5',
                },
              ]}
            >
              {isActive ? (
                <AlertTriangle size={12} color="#DC2626" strokeWidth={2.5} />
              ) : (
                <Text style={{ color: '#16A34A', fontSize: 12 }}>✓</Text>
              )}

              <Text
                style={[
                  styles.badgeText,
                  {
                    color: isActive ? '#DC2626' : '#16A34A',
                  },
                ]}
              >
                {isActive ? 'PERINGATAN AKTIF' : 'PERINGATAN BERAKHIR'}
              </Text>
            </View>
          </View>

          <Text style={styles.mainLocation}>
            {tsunamiData?.area || 'Lokasi Tidak Diketahui'}
          </Text>
        </View>

        {/* STATS GRID */}
        <View style={styles.sleekStatsContainer}>
          <View style={styles.sleekStatBox}>
            <Text style={styles.statLabel}>MAGNITUDO</Text>
            <Text style={styles.statValue}>
              {tsunamiData?.magnitude || '-'}
            </Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.sleekStatBox}>
            <Text style={styles.statLabel}>KEDALAMAN</Text>
            <View style={styles.inlineStat}>
              <Activity size={16} color="#0F172A" style={{ marginRight: 6 }} />
              <Text style={styles.statValueSub}>
                {tsunamiData?.depth || '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* LOKASI EPISENTRUM - TIDAK DIUBAH */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Lokasi & Visualisasi BMKG</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              marginBottom: 12,
            }}
          >
            {[
              { key: 'epicenter', label: 'Episentrum' },
              { key: 'shakemap', label: 'Shake Map' },
              { key: 'wzmap', label: 'Zona Tsunami' },
              { key: 'ttmap', label: 'Travel Time' },
              { key: 'sshmap', label: 'Sea Surface' },
            ].map(item => (
              <TouchableOpacity
                key={item.key}
                onPress={() => setSelectedMap(item.key as any)}
                style={[
                  styles.mapTab,
                  selectedMap === item.key && styles.mapTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.mapTabText,
                    selectedMap === item.key && styles.mapTabTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.mapContainer}>
            <View
              style={{
                flex: 1,
                display: selectedMap === 'epicenter' ? 'flex' : 'none',
              }}
            >
              <WebView
                ref={webviewRef}
                source={{
                  html: generateMapHTML({
                    showZoomControl: true,
                  }),
                }}
                onMessage={onMapMessage}
                originWhitelist={['*']}
                javaScriptEnabled
                domStorageEnabled
                style={styles.map}
              />
            </View>

            {selectedMap !== 'epicenter' && (
              <Pressable
                style={{ flex: 1 }}
                onPress={() => setPreviewVisible(true)}
              >
                <Image
                  source={{
                    uri: `${mapBaseUrl}${selectedImage}`,
                  }}
                  resizeMode="contain"
                  style={styles.bmkgImage}
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* INFORMASI KEJADIAN */}
        <View style={styles.editorialCard}>
          <Text style={styles.sectionHeadingClean}>Informasi Kejadian</Text>

          <View style={styles.infoRowClean}>
            <View style={styles.infoRowLeft}>
              <Calendar size={16} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.infoLabelClean}>Tanggal Gempa</Text>
            </View>
            <Text style={styles.infoValueClean}>
              {tsunamiData?.event_date || '-'}
            </Text>
          </View>

          <View style={styles.infoRowClean}>
            <View style={styles.infoRowLeft}>
              <Clock size={16} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.infoLabelClean}>Waktu Gempa</Text>
            </View>
            <Text style={styles.infoValueClean}>
              {tsunamiData?.event_time || '-'}
            </Text>
          </View>

          <View style={styles.infoRowClean}>
            <View style={styles.infoRowLeft}>
              <Bell size={16} color="#64748B" style={{ marginRight: 8 }} />
              <Text style={styles.infoLabelClean}>Update BMKG</Text>
            </View>
            <Text style={styles.infoValueClean}>
              {tsunamiData?.timesent || '-'}
            </Text>
          </View>
        </View>

        {/* INFORMASI & INSTRUKSI */}
        <View style={styles.instructionCard}>
          <Text style={styles.sectionHeadingClean}>Aksi & Potensi</Text>
          <Text style={styles.bodyText}>
            {tsunamiData?.potential || 'Tidak ada data potensi.'}
          </Text>

          <View style={styles.lightDivider} />

          <Text style={styles.instructionLabelClean}>
            INSTRUKSI KESELAMATAN
          </Text>
          <Text style={styles.instructionText}>
            {tsunamiData?.instruction || 'Ikuti arahan petugas BPBD setempat.'}
          </Text>
        </View>

        {/* DETAIL HEADLINE */}
        {tsunamiData?.headline && (
          <View style={styles.editorialCard}>
            <Text style={styles.sectionHeadingClean}>Laporan Resmi BMKG</Text>
            <Text style={styles.secondaryText}>{tsunamiData.headline}</Text>
          </View>
        )}

        {/* WILAYAH TERDAMPAK */}
        <View style={styles.editorialCard}>
          <Text style={styles.sectionHeadingClean}>
            Estimasi Wilayah Terdampak
          </Text>

          {affectedAreas.map((item: any, index: number) => {
            const statusStyle = getLevelColor(item.level);
            return (
              <View
                key={index}
                style={[
                  styles.minimalAreaRow,
                  index === affectedAreas.length - 1 && styles.areaRowLast,
                ]}
              >
                <View style={styles.dotIndicatorWrapper}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusStyle.text },
                    ]}
                  />
                  <View style={styles.areaTextContainer}>
                    <Text style={styles.districtText}>{item.district}</Text>
                    <Text style={styles.provinceText}>{item.province}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.sleekStatusBadge,
                    {
                      backgroundColor: statusStyle.bg,
                      borderColor: statusStyle.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sleekStatusText,
                      { color: statusStyle.text },
                    ]}
                  >
                    {item.level}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* MODAL PREVIEW IMAGE */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <Pressable
          onPress={() => setPreviewVisible(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.95)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{
              uri: `${mapBaseUrl}${selectedImage}`,
            }}
            resizeMode="contain"
            style={{
              width: '100%',
              height: '80%',
            }}
          />
          <Text
            style={{
              color: '#FFF',
              marginTop: 16,
            }}
          >
            Ketuk layar untuk menutup
          </Text>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default TsunamiDetailScreen;
