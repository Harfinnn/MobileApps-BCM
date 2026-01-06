import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageSlider from '../../components/common/ImageSlider';
import PosterGallery from '../../components/common/PosterGallery';
import SmallBanner from '../../components/common/SmallBanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import HomeMenu from '../../components/menu/HomeMenu';
import { useFocusEffect } from '@react-navigation/native';
import { useLayout } from '../../contexts/LayoutContext';

const HomeScreen = () => {
  const [nama, setNama] = useState('User');

  const { setTitle, setShowBack, setHideNavbar } = useLayout();

  useFocusEffect(
    useCallback(() => {
      setTitle('Home');
      setShowBack(false);
      setHideNavbar(false);
    }, [setTitle, setShowBack, setHideNavbar]),
  );

  useEffect(() => {
    const loadUser = async () => {
      const userString = await AsyncStorage.getItem('user');

      if (userString) {
        const user = JSON.parse(userString);
        setNama(user.user_nama);
      }
    };
    loadUser();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 14) return 'Good Morning ';
    if (hour >= 14 && hour < 17) return 'Good Afternoon ';
    if (hour >= 15 && hour < 19) return 'Good Evening ';
    return 'Good Night ';
  };

  const getWeatherAnimation = () => {
    const hour = new Date().getHours();

    if (hour >= 7 && hour < 14) {
      return require('../../assets/lottie/Weather-sunny.json');
    }

    if (hour >= 14 && hour < 18) {
      return require('../../assets/lottie/Summer-Vibes.json');
    }

    return require('../../assets/lottie/Weather-night.json');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#F3F4F6' }}
        contentContainerStyle={{
          paddingBottom: 140,
        }}
      >
        <ImageSlider />

        {/* GREETING */}
        <View style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingSmall}>{getGreeting()}</Text>
            <Text style={styles.greetingName}>{nama}</Text>
          </View>

          <LottieView
            source={getWeatherAnimation()}
            autoPlay
            loop
            style={styles.weatherAnim}
          />
        </View>

        {/* BANNER KECIL */}
        <SmallBanner />

        <View style={styles.section}>
          <HomeMenu />
        </View>

        {/* POSTER EDUKASI */}
        <PosterGallery />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  greetingCard: {
    marginTop: 16,
    marginHorizontal: 18,
    padding: 12,
    borderRadius: 14,
    borderColor: 'rgba(18, 203, 236, 1)',
    borderWidth: 2,
    backgroundColor: '#F9FAFB',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  greetingSmall: {
    fontSize: 13,
    color: '#F8AD3CFF',
  },

  greetingName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  weatherAnim: {
    width: 60,
    height: 60,
  },

  section: {
    marginTop: 20,
  },
});
