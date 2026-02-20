import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ProfileMenu({ visible, onClose }: Props) {
  const navigation = useNavigation<any>();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View
        style={[
          styles.menuCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Pointer Minimalis */}
        <View style={styles.arrowUp} />

        {/* ITEM: PROFILE */}
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.menuItem}
          onPress={() => {
            onClose();
            navigation.navigate('Main', { screen: 'Profile' });
          }}
        >
          <View style={styles.dotIcon} />
          <Text style={styles.menuLabel}>Profil Saya</Text>
        </TouchableOpacity>

        {/* ITEM: ABOUT */}
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.menuItem}
          onPress={() => {
            onClose();
            navigation.navigate('Main', { screen: 'About' });
          }}
        >
          <View style={styles.dotIcon} />
          <Text style={styles.menuLabel}>Tentang</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* ITEM: LOGOUT */}
        <TouchableOpacity
          activeOpacity={0.6}
          style={[styles.menuItem, { marginTop: 4 }]}
          onPress={() => {
            onClose();
            navigation.navigate('Main', { screen: 'PanggilanDarurat' });
          }}
        >
          <View style={[styles.dotIcon, { backgroundColor: '#EF4444' }]} />
          <Text style={[styles.menuLabel, styles.logoutLabel]}>Panggilan Darurat</Text>
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
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  menuCard: {
    position: 'absolute',
    top: 75,
    right: 25,
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 6,

    // Shadow halus (Soft Shadow)
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  arrowUp: {
    position: 'absolute',
    top: -6,
    right: 18,
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    zIndex: -1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  dotIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00A39D', // Tosca BSI
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    letterSpacing: 0.3,
  },
  logoutLabel: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
    marginHorizontal: 12,
  },
});
