import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';
import styles from '../styles/auth/loadingStyle';

export default function LoadingScreen() {
  const navigation = useNavigation<any>();
  const { user, loading } = useUser();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // 🔹 Animasi Logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    if (loading) return;

    const timeout = setTimeout(() => {
      // 🚨 Cek apakah masih di screen Loading
      const state = navigation.getState();
      const currentRoute = state?.routes?.[state.index]?.name;

      // Kalau sudah bukan Loading (misal sudah ke Detail dari notif)
      if (currentRoute !== 'Loading') {
        return;
      }

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
    }, 1500);

    return () => clearTimeout(timeout);
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A39D" />

      <View style={styles.circleTop} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image
          source={require('../assets/newfavicon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={styles.loadingText}>Menyiapkan data...</Text>
        </View>
      </Animated.View>

      <Text style={styles.footerText}>Secure & Trusted System</Text>
      <View style={styles.circleBottom} />
    </View>
  );
}
