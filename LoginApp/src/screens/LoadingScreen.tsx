import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StatusBar,
  Easing,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo'; // Import library jaringan

// Pastikan path import ini sesuai dengan struktur folder Anda
import { useUser } from '../contexts/UserContext';
import { useAppConfig } from '../contexts/AppConfigContext';
import styles from '../styles/auth/loadingStyle';

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, loading } = useUser();
  const { config } = useAppConfig(); // <-- Mengambil config dari AppConfigContext

  // --- 1. STATE UNTUK LOGIKA ---
  const [loadingText, setLoadingText] = useState<string>('Menyiapkan data...');
  const [isOffline, setIsOffline] = useState<boolean>(false); // State baru untuk error jaringan

  // --- 2. NILAI ANIMASI (REFS) ---
  const logoFade = useRef(new Animated.Value(0)).current;
  const lottieFade = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  const floatAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0.4)).current;
  const bgScale = useRef(new Animated.Value(1)).current;
  const bgRotate = useRef(new Animated.Value(0)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  // --- 3. REFS UNTUK TIMER (Agar bisa di-reset) ---
  const textIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Teks yang akan ditampilkan bergantian
  const textPhases: string[] = [
    'Menyiapkan data...',
    'Memeriksa keamanan...',
    'Memuat ruang kerja...',
    'Hampir siap...',
  ];

  // --- FUNGSI UTAMA: PROSES LOADING & CEK KONEKSI ---
  const startInitialization = () => {
    // Reset state jika user menekan "Coba Lagi"
    setIsOffline(false);
    setLoadingText('Menyiapkan data...');
    let phaseIndex = 0;

    // 1. Jalankan Progressive Text
    textIntervalRef.current = setInterval(() => {
      phaseIndex += 1;
      if (phaseIndex < textPhases.length) {
        setLoadingText(textPhases[phaseIndex]);
      }
    }, 1200);

    // 2. Cek Jaringan & Simulasi Proses Data
    navTimeoutRef.current = setTimeout(async () => {
      // Mengecek status internet secara real-time
      const networkState = await NetInfo.fetch();

      // JIKA OFFLINE / TIDAK ADA INTERNET
      if (!networkState.isConnected) {
        if (textIntervalRef.current) clearInterval(textIntervalRef.current);
        setIsOffline(true); // Memunculkan tombol Coba Lagi
        setLoadingText('Koneksi Terputus');
        return;
      }

      // JIKA ONLINE: Lanjut animasi keluar dan pindah halaman
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (user) {
          navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      });
    }, 4500); // Cek koneksi setelah 4.5 detik
  };

  useEffect(() => {
    /* --- ANIMASI DEKORATIF (Berjalan terus menerus) --- */
    Animated.stagger(300, [
      Animated.parallel([
        Animated.timing(logoFade, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 20,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(lottieFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 2500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgScale, {
          toValue: 1.15,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bgScale, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(bgRotate, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgColorAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(bgColorAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ]),
    ).start();

    // Mulai proses inisialisasi aplikasi saat pertama kali mount
    startInitialization();

    // Cleanup timer saat unmount
    return () => {
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, [navigation, user]);

  /* --- INTERPOLASI --- */
  const spin = bgRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const backgroundColor = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#00A39D', '#007A75'],
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor, opacity: screenOpacity }]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#00A39D" />

      {/* Shapes */}
      <Animated.View
        style={[
          styles.circleTop,
          { transform: [{ scale: bgScale }, { rotate: spin }] },
        ]}
      />
      <Animated.View
        style={[
          styles.circleBottom,
          { transform: [{ scale: bgScale }, { rotate: spin }] },
        ]}
      />

      <Animated.View
        style={[
          styles.content,
          { transform: [{ scale: scaleAnim }, { translateY: floatAnim }] },
        ]}
      >
        {/* Logo */}
        <Animated.View style={{ opacity: logoFade }}>
          <Image
            source={
              config?.mla_logo
                ? { uri: config.mla_logo }
                : require('../assets/newfavicon.png')
            }
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Kondisional Render: Jika Offline tampilkan tombol, Jika Online tampilkan Lottie */}
        {isOffline ? (
          <Animated.View
            style={[localStyles.errorContainer, { opacity: textFade }]}
          >
            <Text style={[styles.loadingText, localStyles.errorText]}>
              {loadingText}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={localStyles.retryButton}
              onPress={startInitialization} // Memanggil ulang fungsi init
            >
              <Text style={localStyles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            <Animated.View style={{ opacity: lottieFade }}>
              <LottieView
                source={require('../assets/loading.json')}
                autoPlay
                loop
                style={styles.lottie}
              />
            </Animated.View>

            <Animated.View style={{ opacity: textFade }}>
              <Animated.Text
                style={[styles.loadingText, { opacity: textOpacity }]}
              >
                {loadingText}
              </Animated.Text>
            </Animated.View>
          </>
        )}
      </Animated.View>

      {/* Footer & Version Info */}
      <View style={localStyles.footerWrapper}>
        <Text style={styles.footerText}>Secure & Trusted System</Text>
        <Text style={localStyles.versionText}>
          v{config?.mla_versi || '1.0.0'}
        </Text>
      </View>
    </Animated.View>
  );
};

// Styling lokal khusus untuk komponen Error/Offline & Footer
const localStyles = StyleSheet.create({
  errorContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: '#FFE5E5', // Sedikit kemerahan untuk menandakan error
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 30, // Jarak dari bawah layar
    width: '100%',
    alignItems: 'center',
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.6)', // Sedikit transparan agar tidak mendistraksi
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 1,
  },
});

export default LoadingScreen;
