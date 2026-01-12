import React, { useCallback, useState, useRef } from 'react';
import { View, ScrollView, BackHandler, ToastAndroid } from 'react-native';
import ImageSlider from '../../components/common/ImageSlider';
import SmallBanner from '../../components/common/SmallBanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeMenu from '../../components/menu/HomeMenu';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLayout } from '../../contexts/LayoutContext';
import DashboardMenu from '../../components/menu/DashboardMenu';
import { NEWS_DUMMY } from '../../data/news';
import NewsSection from '../../components/common/NewsSection';
import styles from '../../styles/homeStyle';

const HomeScreen = () => {
  const { setShowBack, setHideNavbar } = useLayout();
  const navigation = useNavigation<any>();
  const [showDashboard, setShowDashboard] = useState(false);
  const backPressedOnce = useRef(false);

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

  useFocusEffect(
    useCallback(() => {
      setShowBack(false);
      setHideNavbar(false);
    }, [setShowBack, setHideNavbar]),
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        style={{ backgroundColor: '#ffff' }}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
      >
        <ImageSlider />

        <View style={styles.whiteContainer}>
          <View style={styles.section}>
            <HomeMenu onDashboardPress={() => setShowDashboard(true)} />
          </View>

          <SmallBanner />

          <NewsSection
            data={NEWS_DUMMY}
            onItemPress={item =>
              navigation.navigate('DetailBerita', { id: item.id })
            }
          />
        </View>
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

export default HomeScreen;
