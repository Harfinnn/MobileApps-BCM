import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
  onLogout: () => void;
  onProfile: () => void;
};

export default function ProfileMenu({
  visible,
  onClose,
  onLogout,
  onProfile,
}: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(visible ? 1 : 0, { duration: 180 });
    opacity.value = withTiming(visible ? 1 : 0, { duration: 180 });
  }, [visible]);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View style={[styles.menu, menuStyle]}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            setTimeout(() => {
              onProfile();
            }, 120);
          }}
        >
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>Help</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item} onPress={onLogout}>
          <Text style={[styles.text, styles.logout]}>Logout</Text>
        </TouchableOpacity>
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
    right: 20,
    width: 160,

    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,

    elevation: 6,
  },

  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  text: {
    fontSize: 14,
    color: '#111827',
  },

  logout: {
    color: '#EF4444',
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 6,
  },
});
