import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
} from 'react-native';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { WebView } from 'react-native-webview';

import API from '../../../services/api';
import styles from '../../../styles/bencana/detailBencanaStyle';
import { useLayout } from '../../../contexts/LayoutContext';
import { resolveImageUri } from '../../../utils/image';

const DetailBencanaScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const id = route.params?.id;

  const { setTitle, setShowBack, setHideNavbar, setOnBack } = useLayout();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);

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
        {/* MAP SECTION - Tidak menempel ke atas sekali */}
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

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Pelapor</Text>
              <Text style={styles.value}>{data.pelapor}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Waktu</Text>
              <Text style={styles.value}>{data.created_at}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lokasi</Text>
            <Text style={styles.sectionValue}>{data.lokasi || '-'}</Text>
          </View>

          {data.foto && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Foto Laporan</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShowImage(true)}
              >
                <Image
                  source={{ uri: resolveImageUri(data.foto) }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

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
