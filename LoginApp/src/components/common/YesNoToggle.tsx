import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

interface Props {
  value: boolean;
  onChange: (val: boolean) => void;
}

const YesNoToggle = ({ value, onChange }: Props) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 50,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 58],
  });

  // Interpolasi warna: Abu-abu ke Merah Bencana
  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#94A3B8', '#E11D48'], // Slate 400 ke Rose 600 (Merah tegas tapi modern)
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.slider,
          {
            transform: [{ translateX }],
            backgroundColor,
          },
        ]}
      />

      <TouchableOpacity
        style={styles.option}
        onPress={() => onChange(false)}
        activeOpacity={1}
      >
        <Text style={[styles.text, !value && styles.activeText]}>Tidak</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => onChange(true)}
        activeOpacity={1}
      >
        <Text style={[styles.text, value && styles.activeText]}>Ya</Text>
      </TouchableOpacity>
    </View>
  );
};

export default YesNoToggle;

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 36,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    flexDirection: 'row',
    position: 'relative',
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slider: {
    position: 'absolute',
    width: 56,
    height: 28,
    borderRadius: 8,
    top: 3,
    left: 3,
    // Efek glow merah tipis saat aktif (iOS/Android Support)
    elevation: 4,
    shadowColor: '#E11D48',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '800',
  },
  activeText: {
    color: '#FFF',
  },
});
