import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function ProfileMenu({ visible, onClose, onLogout }: Props) {
  const navigation = useNavigation<any>();

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            navigation.navigate('Main', {
              screen: 'Profile',
            });
          }}
        >
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            navigation.navigate('Main', {
              screen: 'About',
            });
          }}
        >
          <Text style={styles.text}>About</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            onLogout();
          }}
        >
          <Text style={[styles.text, styles.logout]}>Logout</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 12,
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
