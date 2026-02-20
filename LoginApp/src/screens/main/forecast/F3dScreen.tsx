import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Droplets,
  Wind,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import styles from '../../../styles/forecast/f3dStyle';
import { useForecast } from './hooks/useForecast';
import {
  getWeatherAnimation,
  getWeatherIcon,
} from '../../../utils/weatherHelper';
import ForecastSkeleton from '../../../components/skeleton/ForecastSkeleton';
import AnimatedTemp from './components/AnimatedTemp';
import WeatherEffect from '../../../components/common/WeatherEffect';

export default function F3dScreen() {
  const { weatherData, warning, loading, refetch, locationName } =
    useForecast();

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showAnimation, setShowAnimation] = React.useState(false);

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
          {' '}
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
          contentContainerStyle={{ paddingBottom: 40 }} // Memberi ruang di bawah
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
                <View style={styles.dateBadge}>
                  <Calendar size={14} color="#64748b" />
                  <Text style={styles.headerDate}>{main.day}</Text>
                </View>
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
              <View style={styles.analyticsCard}>
                <View style={styles.analyticsHeader}>
                  <Text style={styles.analyticsTitle}>Detail Kondisi</Text>
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: '#f0f9ff' },
                      ]}
                    >
                      <Droplets size={18} color="#0ea5e9" />
                    </View>
                    <View>
                      <Text style={styles.statLabel}>Kelembaban</Text>
                      <Text style={styles.statValue}>
                        {main.summary.humidity}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerV} />
                  <View style={styles.statBox}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: '#f0fdf4' },
                      ]}
                    >
                      <Wind size={18} color="#10b981" />
                    </View>
                    <View>
                      <Text style={styles.statLabel}>Angin</Text>
                      <Text style={styles.statValue}>
                        {main.summary.wind}{' '}
                        <Text style={styles.unitText}>km/h</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Prakiraan Harian</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isOpen = expandedIndex === index;
            return (
              <View
                style={[
                  styles.forecastCard,
                  isOpen && styles.forecastCardActive,
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setExpandedIndex(isOpen ? null : index)}
                >
                  <View style={styles.forecastSummaryRow}>
                    <View style={styles.forecastLeft}>
                      <View style={styles.forecastIconBg}>
                        {getWeatherIcon(item.summary.condition, 24)}
                      </View>
                      <View>
                        <Text style={styles.forecastDay}>
                          {index === 0 ? 'Hari Ini' : item.day}
                        </Text>
                        <Text style={styles.forecastConditionText}>
                          {item.summary.condition}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.forecastTempText}>
                      {item.summary.temp}°
                    </Text>
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.hourlyList}>
                    {item.hourly.slice(0, 5).map((hour, i) => (
                      <View key={i} style={styles.hourlyItem}>
                        <Text style={styles.hourlyTimeText}>{hour.time}</Text>
                        {getWeatherIcon(hour.condition, 18)}
                        <Text style={styles.hourlyTempText}>{hour.temp}°</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
