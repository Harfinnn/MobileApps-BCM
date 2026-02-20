import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function NotificationSkeleton() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 700 }),
      -1,
      true,
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.item, animStyle]}>
      <View style={styles.dot} />
      <View style={styles.content}>
        <View style={styles.lineShort} />
        <View style={styles.lineLong} />
        <View style={styles.lineTiny} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginTop: 6,
    marginRight: 10,
  },

  content: {
    flex: 1,
  },

  lineShort: {
    width: '40%',
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 6,
  },

  lineLong: {
    width: '80%',
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 6,
  },

  lineTiny: {
    width: '30%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});
