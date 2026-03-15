import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';
import styles from '../styles/auth/loadingStyle';
import { useAppConfig } from '../contexts/AppConfigContext';
import LottieView from 'lottie-react-native';

export default function LoadingScreen() {
  const navigation = useNavigation<any>();
  const { user, loading } = useUser();
  const { config } = useAppConfig();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const startTime = useRef(Date.now());

  useEffect(() => {
    /* Animasi Logo */
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    /* Floating animation */
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const timeout = setTimeout(() => {
      const state = navigation.getState();
      const currentRoute = state?.routes?.[state.index]?.name;

      if (currentRoute !== 'Loading') return;

      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }, 5000); // 🔥 selalu 5 detik

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A39D" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
          },
        ]}
      >
        <Image
          source={
            config?.mla_logo
              ? { uri: config.mla_logo }
              : require('../assets/newfavicon.png')
          }
          style={styles.logo}
          resizeMode="contain"
        />

        <LottieView
          source={require('../assets/loading.json')}
          autoPlay
          loop
          style={styles.lottie}
        />

        <Text style={styles.loadingText}>Menyiapkan data...</Text>
      </Animated.View>

      <Text style={styles.footerText}>Secure & Trusted System</Text>
    </View>
  );
}
