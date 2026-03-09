import React, { useEffect, useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Platform,
  UIManager,
  LayoutAnimation,
  FlatList,
  InteractionManager,
} from 'react-native';

import { AlertTriangle, CheckCircle, Info } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

import styles from '../../../styles/forecast/f3dStyle';
import { useForecast } from './hooks/useForecast';
import { getWeatherAnimation } from '../../../utils/weatherHelper';

import ForecastSkeleton from '../../../components/skeleton/ForecastSkeleton';
import AnimatedTemp from './components/AnimatedTemp';
import WeatherEffect from '../../../components/common/WeatherEffect';
import ForecastItem from '../../../components/forecast/ForecastItem';
import AnalyticsCard from '../../../components/forecast/AnalyticsCard';

import { useLayout } from '../../../contexts/LayoutContext';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function F3dScreen() {
  const { weatherData, warning, loading, refetch, locationName } =
    useForecast();

  const main = weatherData?.[0];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const { setHideHeader } = useLayout();

  /* ===============================
     ICON + STYLE
  =============================== */

  const getWarningIcon = useCallback((type: string) => {
    switch (type) {
      case 'safe':
        return <CheckCircle size={20} color="#10B981" />;
      case 'info':
        return <Info size={20} color="#3B82F6" />;
      case 'warning':
        return <AlertTriangle size={20} color="#F59E0B" />;
      case 'alert':
        return <AlertTriangle size={20} color="#EF4444" />;
      default:
        return <AlertTriangle size={20} color="#64748B" />;
    }
  }, []);

  const getWarningStyle = useCallback((type: string) => {
    switch (type) {
      case 'safe':
        return styles.safeBanner;
      case 'info':
        return styles.infoBanner;
      case 'warning':
        return styles.warningBanner;
      case 'alert':
        return styles.dangerBanner;
      default:
        return styles.infoBanner;
    }
  }, []);

  /* ===============================
     MEMO DATA
  =============================== */

  const animationSource = useMemo(() => {
    if (!showAnimation || !main?.summary?.condition) return null;
    return getWeatherAnimation(main.summary.condition);
  }, [main, showAnimation]);

  const getHumidityStatus = useCallback((humidity: number) => {
    if (humidity < 40) return 'Udara cenderung kering';
    if (humidity <= 70) return 'Kelembaban normal';
    return 'Udara cukup lembab';
  }, []);

  const getWindStatus = useCallback((wind: number) => {
    if (wind < 10) return 'Angin tenang';
    if (wind <= 25) return 'Angin sedang';
    return 'Angin cukup kencang';
  }, []);

  const toggleItem = useCallback((index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(prev => (prev === index ? null : index));
  }, []);

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <ForecastItem
        item={item}
        index={index}
        isOpen={expandedIndex === index}
        onToggle={() => toggleItem(index)}
      />
    ),
    [expandedIndex, toggleItem],
  );

  /* ===============================
     HEADER COMPONENT
  =============================== */

  const headerComponent = useMemo(() => {
    if (!main) return null;

    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.headerDate}>{main.day}</Text>

          {locationName && (
            <Text style={styles.headerLocation}>{locationName}</Text>
          )}
        </View>

        <View style={styles.heroSection}>
          <View style={styles.heroTextContent}>
            <AnimatedTemp value={main.summary.temp} />
            <Text style={styles.heroCondition}>{main.summary.condition}</Text>
          </View>

          {showAnimation && animationSource && (
            <View style={styles.animationContainer}>
              <WeatherEffect condition={main.summary.condition} />

              <LottieView
                source={animationSource}
                autoPlay
                loop
                renderMode="HARDWARE"
                style={styles.lottieHero}
              />
            </View>
          )}
        </View>

        {warning && (
          <View style={[styles.alertBanner, getWarningStyle(warning.type)]}>
            <View style={styles.alertIconWrapper}>
              {getWarningIcon(warning.type)}
            </View>

            <View style={styles.alertTextWrapper}>
              <Text style={styles.alertTitle}>{warning.title}</Text>

              {warning.description && (
                <Text style={styles.alertDesc}>{warning.description}</Text>
              )}
            </View>
          </View>
        )}

        <AnalyticsCard
          humidity={main.summary.humidity}
          wind={main.summary.wind}
          getHumidityStatus={getHumidityStatus}
          getWindStatus={getWindStatus}
        />

        <Text style={styles.sectionTitle}>Prakiraan Harian</Text>
      </View>
    );
  }, [
    main,
    warning,
    showAnimation,
    animationSource,
    locationName,
    getWarningIcon,
    getWarningStyle,
    getHumidityStatus,
    getWindStatus,
  ]);

  /* ===============================
     FUNCTIONS
  =============================== */

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  /* ===============================
     EFFECT
  =============================== */

  useEffect(() => {
    setHideHeader(true);
  }, [setHideHeader]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setShowAnimation(true);
    });

    return () => task.cancel();
  }, []);

  /* ===============================
     LOADING
  =============================== */

  if (loading) {
    return (
      <LinearGradient colors={['#f8fafc', '#ffffff']} style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <ForecastSkeleton />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!weatherData || weatherData.length === 0) {
    return (
      <LinearGradient colors={['#f8fafc', '#ffffff']} style={styles.container}>
        <SafeAreaView style={styles.center}>
          <Text>Tidak ada data cuaca tersedia</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  /* ===============================
     UI
  =============================== */

  return (
    <LinearGradient colors={['#f8fafc', '#ffffff']} style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={weatherData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `forecast-${index}`}
          ListHeaderComponent={headerComponent}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={3}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#0ea5e9"
            />
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
