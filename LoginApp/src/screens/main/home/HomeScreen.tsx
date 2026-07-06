import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  BackHandler,
  ToastAndroid,
  RefreshControl,
  Pressable,
  Text,
  Modal,
} from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import ImageSlider from '../../../components/common/ImageSlider';
import SmallBanner from '../../../components/common/SmallBanner';
import HomeMenu from '../../../components/menu/HomeMenu';
import DashboardMenu from '../../../components/menu/DashboardMenu';
import NewsSection from '../../../components/common/NewsSection';
import HomeSkeleton from '../../../components/skeleton/HomeSkeleton';
import TsunamiWarningCard from '../../../components/common/TsunamiWarningCard';
import GempaWarningCard from '../../../components/common/GempaWarningCard';

import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import API from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../../styles/dashboard/homeStyle';

import { useRoute } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { setShowBack, setHideNavbar, setShowSearch } = useLayout();

  const [refreshing, setRefreshing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [panduan, setPanduan] = useState([]);
  const [showGempaPopup, setShowGempaPopup] = useState(false);
  const [gempaData, setGempaData] = useState<any>(null);

  const [showTsunamiWarning, setShowTsunamiWarning] = useState(true);
  const [tsunamiData, setTsunamiData] = useState<any>(null);

  // State untuk management card gempa (Disederhanakan tanpa status unread)
  const [showGempaCard, setShowGempaCard] = useState(true);
  const [latestGempaInfo, setLatestGempaInfo] = useState<any>(null);

  const { user } = useUser();
  const isSuperAdmin = user?.jabatan?.jab_id === 1;

  const backPressedOnce = useRef(false);
  const { setHideHeader } = useLayout();

  /* ================= FETCH DATA FUNCTIONS ================= */
  const fetchNews = async () => {
    try {
      const res = await API.get('/berita');

      const beritaArray = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];

      setNewsData(beritaArray);
    } catch (error) {
      console.log('Error fetch berita:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTsunami = async () => {
    try {
      const res = await API.get('/tsunami/latest');

      if (res.data?.status) {
        setTsunamiData(res.data.data);
      }
    } catch (error) {
      console.log('ERROR FETCH TSUNAMI', error);
    }
  };

  const fetchLatestGempa = async () => {
    try {
      const res = await API.get('/gempa/latest');

      if (res.data?.status && res.data.data) {
        setLatestGempaInfo(res.data.data);
        setShowGempaCard(true); // Selalu munculkan kembali jika data berhasil dimuat/di-refresh
      }
    } catch (error) {
      console.log('ERROR FETCH LATEST GEMPA', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    setHideHeader(false);
  }, []);

  useEffect(() => {
    if (!showGempaPopup) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true, // 🚫 BLOCK
    );

    return () => backHandler.remove();
  }, [showGempaPopup]);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await AsyncStorage.getItem('GEMPA_REPORT_STATUS');

      if (status === 'done') {
        setShowGempaPopup(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', checkStatus);

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (route.params?.fromGempaNotif) {
      setGempaData(route.params.gempaData);
      setShowGempaPopup(true);

      // 🔥 reset param supaya tidak muncul lagi saat re-render
      navigation.setParams({
        fromGempaNotif: false,
        gempaData: null,
      });
    }
  }, [route.params]);

  useEffect(() => {
    if (route.params?.reportDone) {
      setShowGempaPopup(false);

      navigation.setParams({ reportDone: false });
    }
  }, [route.params]);

  useEffect(() => {
    if (route.params?.fromGempaNotif) return;

    const checkGempa = async () => {
      try {
        const stored = await AsyncStorage.getItem('LAST_GEMPA_USER');
        const status = await AsyncStorage.getItem('GEMPA_REPORT_STATUS');

        if (stored && status === 'pending') {
          const data = JSON.parse(stored);

          if (data.type === 'gempa' && Number(data.user_jabatan) !== 1) {
            setGempaData(data);
            setShowGempaPopup(true);
          }
        }
      } catch (e) {
        console.log('ERROR GET GEMPA STORAGE', e);
      }
    };

    checkGempa();
  }, [route.params]);

  /* ================= FETCH PANDUAN ================= */
  useEffect(() => {
    const fetchPanduan = async () => {
      try {
        const res = await API.get('/panduan');
        if (res.data?.status) {
          setPanduan(res.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchPanduan();
  }, []);

  /* ================= EXIT APP ================= */
  useFocusEffect(
    useCallback(() => {
      if (showGempaPopup) return;

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (backPressedOnce.current) {
            BackHandler.exitApp();
            return true;
          }

          backPressedOnce.current = true;
          ToastAndroid.show(
            'Tekan sekali lagi untuk keluar',
            ToastAndroid.SHORT,
          );

          setTimeout(() => {
            backPressedOnce.current = false;
          }, 2000);

          return true;
        },
      );

      return () => {
        subscription.remove();
        backPressedOnce.current = false;
      };
    }, [showGempaPopup]),
  );

  /* ================= LAYOUT STATE ================= */
  useFocusEffect(
    useCallback(() => {
      setShowBack(false);
      setHideNavbar(false);
      setShowSearch(true);
    }, [setShowBack, setHideNavbar, setShowSearch]),
  );

  /* ================= BACKGROUND POLLING & FOCUS REFRESH ================= */
  useFocusEffect(
    useCallback(() => {
      fetchTsunami();
      fetchLatestGempa();

      const interval = setInterval(() => {
        console.log('REFRESH TSUNAMI & GEMPA...');
        fetchTsunami();
        fetchLatestGempa();
      }, 60000);

      return () => {
        clearInterval(interval);
      };
    }, []),
  );

  /* ================= REFRESH ================= */
  const onRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    fetchNews();
    fetchTsunami();
    fetchLatestGempa();
  }, [refreshing]);

  /* ================= CALLBACKS / HANDLERS ================= */
  const handleDashboardPress = useCallback(() => {
    setShowDashboard(true);
  }, []);

  const handleSeeAllNews = useCallback(() => {
    navigation.navigate('Berita');
  }, [navigation]);

  const handleNewsPress = useCallback(
    (item: any) => {
      navigation.navigate('DetailBerita', { id: item.dbe_id });
    },
    [navigation],
  );

  const formatTsunamiDate = (dateString: string) => {
    if (!dateString) return '-';

    try {
      const cleanDate = dateString.replace('WIB', '');

      const date = new Date(cleanDate);

      return (
        date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ' ' +
        date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }) +
        ' WIB'
      );
    } catch {
      return dateString;
    }
  };

  const handleGempaPress = (gempa: any) => {
    // Ubah data huruf kecil dari database menjadi format PascalCase yang diminta oleh GempaDetailScreen
    const mappedGempa = {
      Magnitude: gempa.magnitude,
      Wilayah: gempa.wilayah,
      Jam: gempa.jam,
      Tanggal: gempa.tanggal,
      Kedalaman: gempa.kedalaman,
      Coordinates: gempa.coordinates,
      Dirasakan: gempa.dirasakan || null,
      Potensi: gempa.potensi || null,
    };

    navigation.navigate('DetailGempa', { gempa: mappedGempa });
  };

  const handleCloseGempaCard = () => {
    setShowGempaCard(false); // Hanya menyembunyikan card secara lokal sampai di-refresh kembali
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        alwaysBounceVertical={false}
        contentInsetAdjustmentBehavior="never"
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2CCABC']}
            tintColor="#2CCABC"
            progressBackgroundColor="#FFFFFF"
          />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {loading ? (
          <HomeSkeleton />
        ) : (
          <>
            <ImageSlider />

            {/* ================= FLOATING DISASTER CTA ================= */}
            {isSuperAdmin && (
              <Pressable
                style={styles.disasterCTA}
                onPress={() => navigation.navigate('DashboardBencana')}
              >
                <AlertTriangle size={22} color="#fff" />
                <Text style={styles.disasterText}>Situasi Bencana Terkini</Text>
              </Pressable>
            )}

            <View style={styles.whiteContainer}>
              <View style={styles.section}>
                <HomeMenu onDashboardPress={handleDashboardPress} />
              </View>

              {/* ================= BANNER RINGKASAN GEMPA TERKINI ================= */}
              {showGempaCard && latestGempaInfo && (
                <GempaWarningCard
                  Magnitude={latestGempaInfo.magnitude}
                  Wilayah={latestGempaInfo.wilayah}
                  Jam={latestGempaInfo.jam}
                  Kedalaman={latestGempaInfo.kedalaman}
                  onPress={() => handleGempaPress(latestGempaInfo)}
                  onClose={handleCloseGempaCard}
                />
              )}

              {/* ================= TSUNAMI WARNING CARD ================= */}
              {showTsunamiWarning && tsunamiData && tsunamiData.is_active && (
                <TsunamiWarningCard
                  magnitude={tsunamiData.magnitude}
                  area={tsunamiData.area}
                  potential={tsunamiData.potential}
                  sent={formatTsunamiDate(tsunamiData.sent)}
                  onPress={() =>
                    navigation.navigate('TsunamiDetail', {
                      tsunamiData,
                    })
                  }
                  onClose={() => setShowTsunamiWarning(false)}
                />
              )}

              <SmallBanner panduan={panduan} />

              <NewsSection
                data={newsData}
                onItemPress={handleNewsPress}
                onPressAll={handleSeeAllNews}
              />
            </View>
          </>
        )}
      </ScrollView>

      <DashboardMenu
        visible={showDashboard}
        onClose={() => setShowDashboard(false)}
        onIT={() => navigation.navigate('DashboardIT')}
        onNonIT={() => navigation.navigate('DashboardNonIT')}
      />

      <Modal
        visible={showGempaPopup}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 16,
              width: '100%',
            }}
          >
            {/* HEADER */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: '#E53935',
              }}
            >
              ⚠️ Gempa Terdeteksi
            </Text>

            {/* INFO GEMPA */}
            <Text style={{ marginBottom: 5 }}>
              📍 Wilayah: {gempaData?.wilayah}
            </Text>
            <Text style={{ marginBottom: 5 }}>
              📊 Magnitude: {gempaData?.magnitude}
            </Text>
            <Text style={{ marginBottom: 10 }}>🕒 Jam: {gempaData?.jam}</Text>

            {/* PESAN WAJIB */}
            <Text
              style={{
                marginTop: 10,
                marginBottom: 20,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              Kami membutuhkan laporan kondisi di lokasi Anda. Silakan segera
              kirim laporan untuk membantu pemantauan situasi dan respon cepat
              dari tim terkait.
            </Text>

            {/* BUTTON WAJIB */}
            <Pressable
              onPress={async () => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'LaporGempa',
                      params: {
                        fromGempa: true,
                        gempaData,
                      },
                    },
                  ],
                });
              }}
              style={{
                backgroundColor: '#E53935',
                paddingVertical: 14,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 15,
                }}
              >
                Isi Laporan Sekarang
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default React.memo(HomeScreen);
