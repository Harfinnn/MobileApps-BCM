import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';
import styles from '../../../styles/bencana/infoGempaStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AUTOGEMPA_URL = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';
const DIRASAKAN_URL =
  'https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json';

const REFRESH_INTERVAL = 2 * 60 * 1000;

const InfoGempaBumiScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
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

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
          paddingTop: insets.top + 70,
          paddingBottom: insets.bottom + 40,
        },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Gempa Signifikan</Text>
        <Text style={styles.updateText}>
          Gempa utama terbaru menurut BMKG • Auto update 2 menit
        </Text>
      </View>

      {/* MAIN CARD */}
      {mainGempa && (
        <View style={styles.mainCard}>
          <View style={styles.magnitudeContainer}>
            <View style={styles.magCircle}>
              <Text style={styles.magValue}>{mainGempa.Magnitude}</Text>
              <Text style={styles.magUnit}>SR</Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{mainGempa.Potensi}</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>WAKTU</Text>
              <Text style={styles.infoValue}>{mainGempa.Jam}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>KEDALAMAN</Text>
              <Text style={styles.infoValue}>{mainGempa.Kedalaman}</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <Text style={styles.locLabel}>LOKASI</Text>
            <Text style={styles.locValue}>{mainGempa.Wilayah}</Text>
          </View>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() =>
              navigation.navigate('GempaDetail', { gempa: mainGempa })
            }
          >
            <Text style={styles.mapButtonText}>Lihat Detail Gempa</Text>
          </TouchableOpacity>
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
