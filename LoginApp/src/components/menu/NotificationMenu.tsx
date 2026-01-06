import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function NotificationMenu({ visible, onClose }: Props) {
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(visible ? 1 : 0.95, { duration: 180 });
    opacity.value = withTiming(visible ? 1 : 0, { duration: 180 });
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View style={[styles.menu, animStyle]}>
        <Text style={styles.title}>Notifications</Text>

        <View style={styles.item}>
          <Text style={styles.text}>🔔 Tidak ada notifikasi baru</Text>
        </View>

        {/* Contoh item */}
        {/* 
        <View style={styles.item}>
          <Text style={styles.text}>Pesan baru dari Admin</Text>
        </View>
        */}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },

  menu: {
    position: 'absolute',
    top: 70,
    right: 64, 
    width: 220,

    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,

    elevation: 6,
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingBottom: 6,
    color: '#111827',
  },

  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  text: {
    fontSize: 13,
    color: '#374151',
  },
});
