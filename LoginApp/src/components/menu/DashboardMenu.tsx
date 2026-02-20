import React, { useEffect } from 'react';
import { Text, Pressable, View, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import styles from '../../styles/dashboard/dashboardMenuStyle';

const IT_ICON = require('../../assets/gambar_icon/dashboard_it.png');
const NON_IT_ICON = require('../../assets/gambar_icon/dashboard_non_it.png');

type Props = {
  visible: boolean;
  onClose: () => void;
  onIT: () => void;
  onNonIT: () => void;
};

export default function DashboardMenu({
  visible,
  onClose,
  onIT,
  onNonIT,
}: Props) {
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : 40, { duration: 180 });
    opacity.value = withTiming(visible ? 1 : 0, { duration: 180 });
  }, [visible, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View style={[styles.sheet, animatedStyle]}>
        <View style={styles.grid}>
          {/* Dashboard IT */}
          <Pressable
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
            onPress={() => {
              onClose();
              setTimeout(onIT, 120);
            }}
          >
            <Image source={IT_ICON} style={styles.iconImage} />
            <Text style={styles.text}>Dashboard IT</Text>
          </Pressable>

          {/* Dashboard Non IT */}
          <Pressable
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
            onPress={() => {
              onClose();
              setTimeout(onNonIT, 120);
            }}
          >
            <Image source={NON_IT_ICON} style={styles.iconImage} />
            <Text style={styles.text}>Dashboard Non-IT</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
}
