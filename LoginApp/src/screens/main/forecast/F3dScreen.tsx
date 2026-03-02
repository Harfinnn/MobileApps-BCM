import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Platform,
  UIManager,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AlertTriangle, CheckCircle } from 'lucide-react-native';
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

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showAnimation, setShowAnimation] = React.useState(false);
  const [showDetailInfo, setShowDetailInfo] = React.useState(false);

  const { setHideHeader } = useLayout();

  const humidityAnim = React.useRef(new Animated.Value(0)).current;
  const floatAnim = React.useRef(new Animated.Value(0)).current;

  const windAnim = React.useRef(new Animated.Value(0)).current;
  const windShakeAnim = React.useRef(new Animated.Value(0)).current;

  /* ===============================
     DELAY ANIMATION (ANTI LAG)
  =============================== */
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 1200); // 🔥 lebih aman untuk device mid-range

    return () => clearTimeout(timer);
  }, []);
  

  const animationSource = React.useMemo(() => {
    if (!weatherData.length) return null;
    return getWeatherAnimation(weatherData[0].summary.condition);
  }, [weatherData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity < 40) return 'Udara cenderung kering';
    if (humidity <= 70) return 'Kelembaban normal';
    return 'Udara cukup lembab';
  };

  const getWindStatus = (wind: number) => {
    if (wind < 10) return 'Angin tenang';
    if (wind <= 25) return 'Angin sedang';
    return 'Angin cukup kencang';
  };

  /* ===============================
      DROPDOWN ENTRANCE ANIMATION
  =============================== */
  React.useEffect(() => {
    if (showDetailInfo) {
      Animated.stagger(100, [
        Animated.timing(humidityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(windAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      humidityAnim.setValue(0);
      windAnim.setValue(0);
    }
  }, [showDetailInfo]);

  React.useEffect(() => {
    Animated.parallel([
      // Loop Kelembaban (Naik Turun)
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
      // Loop Angin (Kiri Kanan + Skew)
      Animated.loop(
        Animated.sequence([
          Animated.timing(windShakeAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(windShakeAnim, {
            toValue: -1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();

    // Delay Lottie biar gak lag
    const timer = setTimeout(() => setShowAnimation(true), 1200);
    return () => clearTimeout(timer);
  }, []);

   useEffect(() => {
      setHideHeader(true);
    }, []);

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
          <View style={{ height: 10 }} />
          <Text>Tidak ada data cuaca tersedia</Text>
          <TouchableOpacity onPress={refetch}>
            <Text
              style={{ color: '#0ea5e9', marginTop: 10, fontWeight: '600' }}
            >
              Coba Lagi
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const main = weatherData[0];

  return (
    <LinearGradient colors={['#f8fafc', '#ffffff']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={weatherData}
          keyExtractor={(item, index) => `forecast-${index}`}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#0ea5e9"
            />
          }
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              {/* HEADER: Date & Location */}
              <View style={styles.headerTop}>
                <Text style={styles.headerDate}>{main.day}</Text>
                {locationName && (
                  <Text style={styles.headerLocation}>{locationName}</Text>
                )}
              </View>

              {/* HERO SECTION */}
              <View style={styles.heroSection}>
                <View style={styles.heroTextContent}>
                  <AnimatedTemp value={main.summary.temp} />
                  <Text style={styles.heroCondition}>
                    {main.summary.condition}
                  </Text>
                </View>

                {showAnimation && !loading && animationSource && (
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

              {/* WARNING BANNER */}
              {warning && (
                <View
                  style={[
                    styles.alertBanner,
                    warning.type === 'safe'
                      ? styles.safeBanner
                      : styles.dangerBanner,
                  ]}
                >
                  {warning.type === 'safe' ? (
                    <CheckCircle size={20} color="#10b981" />
                  ) : (
                    <AlertTriangle size={20} color="#ef4444" />
                  )}
                  <View style={styles.alertTextWrapper}>
                    <Text
                      style={
                        warning.type === 'safe'
                          ? styles.safeTitle
                          : styles.alertTitle
                      }
                    >
                      {warning.title}
                    </Text>
                    <Text
                      style={
                        warning.type === 'safe'
                          ? styles.safeDesc
                          : styles.alertDesc
                      }
                    >
                      {warning.description}
                    </Text>
                  </View>
                </View>
              )}

              {/* ANALYTICS CARD */}
              <AnalyticsCard
                humidity={main.summary.humidity}
                wind={main.summary.wind}
                getHumidityStatus={getHumidityStatus}
                getWindStatus={getWindStatus}
              />

              <Text style={styles.sectionTitle}>Prakiraan Harian</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <ForecastItem
              item={item}
              index={index}
              isOpen={expandedIndex === index}
              onToggle={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
            />
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
