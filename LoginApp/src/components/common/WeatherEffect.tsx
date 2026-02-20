// src/components/common/WeatherEffect.tsx

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  sun: '#F59E0B',
  cloud: '#94A3B8',
  rain: '#3B82F6',
};

const StormEffect = () => {
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
      ]),
    ).start();
  }, [flashAnim]);

  return (
    <View style={styles.effectContainer}>
      <RainEffect />
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#ffffff',
          opacity: flashAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.4],
          }),
        }}
      />
    </View>
  );
};

// --- KOMPONEN KECIL: RAIN DROP ---
const RainDrop = ({
  delay,
  duration,
  offset,
}: {
  delay: number;
  duration: number;
  offset: number;
}) => {
  const dropAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(dropAnim, {
        toValue: height / 2,
        duration: duration,
        easing: Easing.linear,
        delay: delay,
        useNativeDriver: true,
      }),
    ).start();
  }, [delay, duration, dropAnim]); // Dependency array diperbaiki

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        top: -50,
        left: offset,
        fontSize: 45,
        opacity: 0.6,
        color: COLORS.rain,
        transform: [{ translateY: dropAnim }, { rotate: '-15deg' }],
      }}
    >
      💧
    </Animated.Text>
  );
};

// --- KOMPONEN EFEK: MATAHARI ---
// Dipisah agar hooks (useRef/useEffect) aman
const SunEffect = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [rotateAnim, pulseAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.effectContainer}>
      <Animated.Text
        style={{
          fontSize: 200,
          opacity: 0.4,
          color: COLORS.sun,
          transform: [{ rotate: spin }, { scale: pulseAnim }],
          position: 'absolute',
          top: -60,
          right: -60,
        }}
      >
        ☀️
      </Animated.Text>
    </View>
  );
};

// --- KOMPONEN EFEK: HUJAN ---
const RainEffect = () => {
  // Logic array dibuat statis di setiap render
  const drops = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    offset: Math.random() * 200,
    delay: Math.random() * 1500,
    duration: 1000 + Math.random() * 1000,
  }));

  return (
    <View style={styles.effectContainer}>
      {drops.map(drop => (
        <RainDrop
          key={drop.id}
          delay={drop.delay}
          duration={drop.duration}
          offset={drop.offset}
        />
      ))}
    </View>
  );
};

// --- KOMPONEN EFEK: BERAWAN ---
const CloudEffect = () => {
  const moveAnim1 = useRef(new Animated.Value(0)).current;
  const moveAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = (anim: Animated.Value, dur: number, dist: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: dist,
            duration: dur,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: dur,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      ).start();
    };
    float(moveAnim1, 5000, 20);
    float(moveAnim2, 7000, -30);
  }, [moveAnim1, moveAnim2]);

  return (
    <View style={styles.effectContainer}>
      <Animated.Text
        style={{
          fontSize: 160,
          opacity: 0.25,
          color: COLORS.cloud,
          position: 'absolute',
          top: -30,
          right: -50,
          transform: [{ translateX: moveAnim1 }],
        }}
      >
        ☁️
      </Animated.Text>
      <Animated.Text
        style={{
          fontSize: 100,
          opacity: 0.2,
          color: COLORS.cloud,
          position: 'absolute',
          top: 80,
          right: 120,
          transform: [{ translateX: moveAnim2 }],
        }}
      >
        ☁️
      </Animated.Text>
    </View>
  );
};

// --- KOMPONEN UTAMA (CONTROLLER) ---
// Komponen ini hanya bertugas memilih tampilan, tidak memanggil hooks animasi langsung.
const WeatherEffect = ({ condition }: { condition: string }) => {
  const cond = condition?.toLowerCase() || '';

  // 🌩 Storm / Petir
  if (cond.includes('storm') || cond.includes('petir')) {
    return <StormEffect />;
  }

  // 🌧 Rain
  if (cond.includes('rain') || cond.includes('hujan')) {
    return <RainEffect />;
  }

  // ☁ Cloudy
  if (cond.includes('cloudy') || cond.includes('berawan')) {
    return <CloudEffect />;
  }

  // 🌤 Partly Cloudy
  if (cond.includes('partly') || cond.includes('cerah berawan')) {
    return <CloudEffect />;
  }

  // ☀ Sunny / Summer
  if (
    cond.includes('sunny') ||
    cond.includes('cerah') ||
    cond.includes('summer') ||
    cond.includes('panas')
  ) {
    return <SunEffect />;
  }

  return null;
};

const styles = StyleSheet.create({
  effectContainer: {
    position: 'absolute',
    top: -100,
    right: 0,
    width: 250,
    height: 400,
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
});

export default React.memo(WeatherEffect);
