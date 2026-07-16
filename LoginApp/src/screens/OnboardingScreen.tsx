import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Tipe Data untuk Slide — animation diganti menjadi nama ikon
interface SlideData {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const { width } = Dimensions.get('window');

// Konten Onboarding
const slides: SlideData[] = [
  {
    id: '1',
    title: 'Akbar AI',
    description:
      'Tanya jawab seputar SOP, playbook, dan prosedur tanggap darurat langsung ke asisten AI kapan saja kamu butuh.',
    icon: 'sparkles-outline',
  },
  {
    id: '2',
    title: 'Deteksi Gempa Bumi',
    description:
      'Dapatkan info kekuatan, lokasi, dan potensi dampak gempa secara real-time agar kamu bisa bersiap lebih cepat.',
    icon: 'pulse-outline',
  },
  {
    id: '3',
    title: 'Informasi Real-Time',
    description:
      'Pantau kondisi terkini dan prediksi cuaca dengan data yang akurat langsung di genggamanmu.',
    icon: 'partly-sunny-outline',
  },
  {
    id: '4',
    title: 'Panduan Keselamatan',
    description:
      'Pelajari langkah mitigasi dan panduan penting untuk persiapan dirimu dan orang terdekat.',
    icon: 'shield-checkmark-outline',
  },
  {
    id: '5',
    title: 'Lapor Cepat',
    description:
      'Kirim laporan kejadian di sekitarmu dengan fitur integrasi lokasi dan kamera secara instan.',
    icon: 'megaphone-outline',
  },
];

// Ikon dengan animasi "melayang" + "pulse" ringan sebagai pengganti Lottie
function AnimatedIcon({ name }: { name: keyof typeof Ionicons.glyphMap }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    floatLoop.start();
    pulseLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [floatAnim, pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.iconOuterRing,
        { transform: [{ translateY: floatAnim }, { scale: pulseAnim }] },
      ]}
    >
      <View style={styles.iconInnerCircle}>
        <Ionicons name={name} size={64} color="#00A39D" />
      </View>
    </Animated.View>
  );
}

export default function OnboardingScreen({ navigation }: any) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem('hasLaunched', 'true');
        navigation.replace('Login');
      } catch (error) {
        console.log('Error saving launch status:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sliderContainer}>
        <FlatList
          data={slides}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.imagePlaceholder}>
                <AnimatedIcon name={item.icon} />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={item => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            },
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.paginator}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 24, 10],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={i.toString()}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={scrollToNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1
              ? 'Mulai Eksplorasi'
              : 'Selanjutnya'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sliderContainer: {
    flex: 3,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 72,
  },
  imagePlaceholder: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconOuterRing: {
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: 'rgba(0, 163, 157, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInnerCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A39D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 157, 0.15)',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  footer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  paginator: {
    flexDirection: 'row',
    height: 10,
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00A39D',
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#00A39D',
    width: '100%',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#00A39D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
