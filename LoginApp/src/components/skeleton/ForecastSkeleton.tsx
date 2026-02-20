import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const SkeletonBlock = ({ height, style }: any) => {
  const shimmerAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: width,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View
      style={[
        {
          height,
          backgroundColor: '#e5e7eb',
          overflow: 'hidden',
          borderRadius: 12,
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX: shimmerAnim }],
        }}
      >
        <LinearGradient
          colors={['transparent', '#f3f4f6', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: width / 2, height: '100%' }}
        />
      </Animated.View>
    </View>
  );
};

const ForecastSkeleton = () => {
  return (
    <View style={{ padding: 20 }}>
      {/* Header */}
      <SkeletonBlock height={20} style={{ width: 100, marginBottom: 20 }} />

      {/* Hero */}
      <SkeletonBlock height={270} style={{ marginBottom: 20 }} />

      {/* Analytics */}
      <SkeletonBlock height={160} style={{ marginBottom: 20 }} />

      {/* Forecast List */}
      {[1, 2, 3].map(i => (
        <SkeletonBlock
          key={i}
          height={70}
          style={{ marginBottom: 12 }}
        />
      ))}
    </View>
  );
};

export default ForecastSkeleton;
