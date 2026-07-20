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
  InteractionManager,
} from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import ImageSlider from '../../../components/common/ImageSlider';
import SmallBanner from '../../../components/common/SmallBanner';
import HomeMenu from '../../../components/menu/HomeMenu';
import DashboardMenu from '../../../components/menu/DashboardMenu';
import NewsSection from '../../../components/common/NewsSection';
import HomeSkeleton from '../../../components/skeleton/HomeSkeleton';
import TsunamiWarningCard from '../../../components/common/TsunamiWarningCard';
import GempaWarningCard from '../../../components/common/GempaWarningCard';
import WalkthroughOverlay from '../../../components/common/WalkthroughOverlay';

import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import API from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalkthrough, WalkthroughStep } from '../../../hooks/useWalkthrough';
import { navbarRef } from '../../../utils/navbarRef';

import styles from '../../../styles/dashboard/homeStyle';

const AUTOGEMPA_URL = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';
const WALKTHROUGH_TESTING_MODE = false;

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { setShowBack, setHideNavbar, setShowSearch } = useLayout();

  const [refreshing, setRefreshing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);

  const [newsData, setNewsData] = useState<any[]>([]);
  const [panduan, setPanduan] = useState([]);
  const [showGempaPopup, setShowGempaPopup] = useState(false);
  const [gempaData, setGempaData] = useState<any>(null);

  const [showTsunamiWarning, setShowTsunamiWarning] = useState(true);
  const [tsunamiData, setTsunamiData] = useState<any>(null);

  const [showGempaCard, setShowGempaCard] = useState(true);
  const [latestGempaInfo, setLatestGempaInfo] = useState<any>(null);

  const { user } = useUser();
  const isSuperAdmin = user?.jabatan?.jab_id === 1;

  const backPressedOnce = useRef(false);
  const { setHideHeader } = useLayout();

  const sliderRef = useRef(null);
  const disasterCTARef = useRef(null);
  const menuRef = useRef(null);
  const gempaCardRef = useRef(null);
  const tsunamiCardRef = useRef(null);
  const bannerRef = useRef(null);
  const newsRef = useRef(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const contentWrapperRef = useRef<View>(null);

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
      setNewsLoading(false);
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
      const res = await fetch(`${AUTOGEMPA_URL}?t=${Date.now()}`);
      const json = await res.json();

      const gempa = json?.Infogempa?.gempa;

      if (!gempa) return;

      setLatestGempaInfo({
        magnitude: gempa.Magnitude,
        wilayah: gempa.Wilayah,
        jam: gempa.Jam,
        tanggal: gempa.Tanggal,
        kedalaman: gempa.Kedalaman,
        coordinates: gempa.Coordinates,
        dirasakan: gempa.Dirasakan,
        potensi: gempa.Potensi,
        shakemap: gempa.Shakemap,
      });

      setShowGempaCard(true);
    } catch (error) {
      console.log('ERROR FETCH BMKG', error);
    }
  };

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      fetchNews();
    });
    return () => task.cancel();
  }, []);

  useEffect(() => {
    setHideHeader(false);
  }, []);

  useEffect(() => {
    if (!showGempaPopup) return;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
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
      navigation.setParams({ fromGempaNotif: false, gempaData: null });
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

    const task = InteractionManager.runAfterInteractions(() => {
      fetchPanduan();
    });
    return () => task.cancel();
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
      const task = InteractionManager.runAfterInteractions(() => {
        fetchTsunami();
        // beri jeda kecil supaya nggak numpuk bareng fetchTsunami
        setTimeout(() => fetchLatestGempa(), 300);
      });

      const interval = setInterval(() => {
        fetchTsunami();
        setTimeout(() => fetchLatestGempa(), 300);
      }, 60000);

      return () => {
        task.cancel();
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
    navigation.navigate('GempaDetail', { gempa: mappedGempa });
  };

  const handleCloseGempaCard = () => {
    setShowGempaCard(false);
  };

  /* ================= WALKTHROUGH ================= */
  const steps: WalkthroughStep[] = React.useMemo(() => {
    const s: WalkthroughStep[] = [
      {
        key: 'slider',
        ref: sliderRef,
        text: 'Banner ini menampilkan informasi dan pengumuman terbaru dari BCM24.',
      },
    ];
    if (isSuperAdmin) {
      s.push({
        key: 'disasterCTA',
        ref: disasterCTARef,
        text: 'Pantau & kelola situasi bencana terkini melalui tombol ini.',
      });
    }
    s.push({
      key: 'menu',
      ref: menuRef,
      text: 'Akses cepat ke semua fitur utama BCM24 ada di menu ini.',
    });
    if (showGempaCard && latestGempaInfo) {
      s.push({
        key: 'gempaCard',
        ref: gempaCardRef,
        text: 'Informasi gempa terkini otomatis muncul di sini.',
      });
    }
    if (showTsunamiWarning && tsunamiData?.is_active) {
      s.push({
        key: 'tsunamiCard',
        ref: tsunamiCardRef,
        text: 'Peringatan tsunami aktif akan tampil di kartu ini.',
      });
    }
    s.push({
      key: 'banner',
      ref: bannerRef,
      text: 'Panduan keselamatan bencana bisa dibuka dari sini.',
    });
    s.push({
      key: 'news',
      ref: newsRef,
      text: 'Berita & informasi terbaru seputar bencana ada di bagian ini.',
    });
    s.push({
      key: 'navbar',
      ref: navbarRef,
      text: 'Navigasi cepat ke Home, KCP, Playbook, dan Akbar AI ada di bar bawah ini.',
      scrollable: false,
      tooltipOffsetY: -30,
    });
    return s;
  }, [
    isSuperAdmin,
    showGempaCard,
    latestGempaInfo,
    showTsunamiWarning,
    tsunamiData,
  ]);

  const walkthrough = useWalkthrough(
    steps,
    'hasSeenHomeWalkthrough',
    WALKTHROUGH_TESTING_MODE,
  );

  useEffect(() => {
    if (newsLoading) return;
    const t = setTimeout(() => walkthrough.start(), 700);
    return () => clearTimeout(t);
  }, [newsLoading]);

  useEffect(() => {
    if (!walkthrough.visible) return;

    const step = walkthrough.currentStep;
    const node = step?.ref?.current;
    if (!node) return;

    walkthrough.clearTarget();

    if (step.scrollable === false) {
      setTimeout(() => walkthrough.remeasure(), 150);
      return;
    }

    const scrollNode = scrollViewRef.current;
    const wrapperNode = contentWrapperRef.current;
    if (!scrollNode || !wrapperNode) return;

    node.measureLayout(
      wrapperNode,
      (x: number, y: number) => {
        scrollNode.scrollTo({ y: Math.max(y - 100, 0), animated: true });
        setTimeout(() => walkthrough.remeasure(), 450);
      },
      () => {
        console.log('[WALKTHROUGH] measureLayout gagal untuk step:', step?.key);
        walkthrough.remeasure();
      },
    );
  }, [walkthrough.visible, walkthrough.stepIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
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
        {newsLoading ? (
          <HomeSkeleton />
        ) : (
          <View ref={contentWrapperRef}>
            <View ref={sliderRef}>
              <ImageSlider />
            </View>

            {isSuperAdmin && (
              <Pressable
                ref={disasterCTARef}
                style={styles.disasterCTA}
                onPress={() => navigation.navigate('DashboardBencana')}
              >
                <AlertTriangle size={22} color="#fff" />
                <Text style={styles.disasterText}>Situasi Bencana Terkini</Text>
              </Pressable>
            )}

            <View style={styles.whiteContainer}>
              <View style={styles.section} ref={menuRef}>
                <HomeMenu onDashboardPress={handleDashboardPress} />
              </View>

              {showGempaCard && latestGempaInfo && (
                <View ref={gempaCardRef}>
                  <GempaWarningCard
                    Magnitude={latestGempaInfo.magnitude}
                    Wilayah={latestGempaInfo.wilayah}
                    Jam={latestGempaInfo.jam}
                    Tanggal={latestGempaInfo.tanggal}
                    Kedalaman={latestGempaInfo.kedalaman}
                    onPress={() => handleGempaPress(latestGempaInfo)}
                    onClose={handleCloseGempaCard}
                  />
                </View>
              )}

              {showTsunamiWarning && tsunamiData && tsunamiData.is_active && (
                <View ref={tsunamiCardRef}>
                  <TsunamiWarningCard
                    magnitude={tsunamiData.magnitude}
                    area={tsunamiData.area}
                    potential={tsunamiData.potential}
                    sent={formatTsunamiDate(tsunamiData.sent)}
                    onPress={() =>
                      navigation.navigate('TsunamiDetail', { tsunamiData })
                    }
                    onClose={() => setShowTsunamiWarning(false)}
                  />
                </View>
              )}

              <View ref={bannerRef}>
                <SmallBanner panduan={panduan} />
              </View>

              <View ref={newsRef}>
                {newsData.length > 0 && (
                  <NewsSection
                    data={newsData}
                    onItemPress={handleNewsPress}
                    onPressAll={handleSeeAllNews}
                  />
                )}
              </View>
            </View>
          </View>
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
            <Text style={{ marginBottom: 5 }}>
              📍 Wilayah: {gempaData?.wilayah}
            </Text>
            <Text style={{ marginBottom: 5 }}>
              📊 Magnitude: {gempaData?.magnitude}
            </Text>
            <Text style={{ marginBottom: 10 }}>🕒 Jam: {gempaData?.jam}</Text>
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
            <Pressable
              onPress={async () => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'LaporGempa',
                      params: { fromGempa: true, gempaData },
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

      <WalkthroughOverlay
        visible={walkthrough.visible}
        target={walkthrough.target}
        text={walkthrough.currentStep?.text}
        stepIndex={walkthrough.stepIndex}
        totalSteps={walkthrough.totalSteps}
        isFirst={walkthrough.isFirst}
        isLast={walkthrough.isLast}
        tooltipOffsetY={walkthrough.currentStep?.tooltipOffsetY}
        onNext={walkthrough.next}
        onPrev={walkthrough.prev}
        onSkip={walkthrough.stop}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
