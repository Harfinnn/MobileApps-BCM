import React, { useCallback, useEffect, useState } from 'react';
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
  Dimensions,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';
import styles from '../../../styles/bencana/gempaDetailStyle';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GempaDetailScreen = () => {
  const route = useRoute<any>();
  const { gempa } = route.params;
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch, setHideHeaderLeft } =
    useLayout();

  const [isMapVisible, setIsMapVisible] = useState(false);

  // Fungsi Back
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
    setTitle('Detail Gempa');
    setHideNavbar(true);
    setShowBack(false); 
    setShowSearch(false); 
    setHideHeaderLeft(true); 
    setOnBack(undefined);

    return () => {
      setHideHeaderLeft(false);
      setShowSearch(true);
      setHideNavbar(false);
    };
  }, [navigation]);

  const isStrong = Number(gempa.Magnitude) >= 5.0;
  const mapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Text style={styles.dateHeader}>
            {gempa.Tanggal} • {gempa.Jam}
          </Text>
          <View style={styles.magRow}>
            <Text
              style={[
                styles.magNumber,
                { color: isStrong ? '#E11D48' : '#0F172A' },
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

        {/* BUTTON BUKA PETA */}
        {gempa.Shakemap && (
          <View style={{ paddingHorizontal: 24, marginBottom: 30 }}>
            <TouchableOpacity
              style={styles.mapTrigger}
              onPress={() => setIsMapVisible(true)}
              activeOpacity={0.8}
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

        <View style={styles.dataGrid}>
          <View style={styles.dataRow}>
            <View style={styles.dataItem}>
              <Text style={styles.label}>KEDALAMAN</Text>
              <Text style={styles.value}>{gempa.Kedalaman}</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.label}>KOORDINAT</Text>
              <Text style={styles.value}>{gempa.Coordinates || '-'}</Text>
            </View>
          </View>

          <View style={styles.fullDataItem}>
            <Text style={styles.label}>WILAYAH DIRASAKAN (MMI)</Text>
            <Text style={styles.mmiValue}>
              {gempa.Dirasakan || 'Data tidak dilaporkan'}
            </Text>
          </View>
        </View>

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
      </ScrollView>

      {/* MODAL PETA ZOOMABLE */}
      <Modal visible={isMapVisible} transparent={true} animationType="fade">
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
            centerContent={true}
            contentContainerStyle={styles.modalScroll}
          >
            <Image
              source={{ uri: mapUrl }}
              style={styles.fullMapImage}
              resizeMode="contain"
            />
          </ScrollView>
          <View style={styles.modalFooter}>
            <Text style={styles.zoomHint}>
              Gunakan dua jari untuk memperbesar peta
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GempaDetailScreen;
