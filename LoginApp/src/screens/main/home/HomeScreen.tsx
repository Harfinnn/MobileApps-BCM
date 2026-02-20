import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  BackHandler,
  ToastAndroid,
  RefreshControl,
  Pressable,
  Text,
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

import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import API from '../../../services/api';

import styles from '../../../styles/dashboard/homeStyle';

const HEADER_HEIGHT = 70;

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { setShowBack, setHideNavbar, setShowSearch } = useLayout();

  const [refreshing, setRefreshing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState<any[]>([]);

  const { user } = useUser();
  const isSuperAdmin = user?.jabatan?.jab_id === 1;

  const backPressedOnce = useRef(false);

  /* ================= FETCH NEWS ================= */
  const fetchNews = async () => {
    try {
      const res = await API.get('/berita');
      setNewsData(res.data);
    } catch (error) {
      console.log('Error fetch berita:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* ================= EXIT APP ================= */
  useFocusEffect(
    useCallback(() => {
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
    }, []),
  );

  /* ================= LAYOUT STATE ================= */
  useFocusEffect(
    useCallback(() => {
      setShowBack(false);
      setHideNavbar(false);
      setShowSearch(true);
    }, [setShowBack, setHideNavbar, setShowSearch]),
  );

  /* ================= REFRESH ================= */
  const onRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    fetchNews();
  }, [refreshing]);

  /* ================= CALLBACKS ================= */
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={HEADER_HEIGHT}
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

              <SmallBanner />

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
    </SafeAreaView>
  );
};

export default React.memo(HomeScreen);
