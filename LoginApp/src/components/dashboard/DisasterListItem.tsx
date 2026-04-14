import React from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from '../../styles/bencana/disasterListItemStyle';

type Props = {
  item: any;
  onPress?: () => void;
};

export default function DisasterListItem({ item, onPress }: Props) {
  // Logic penentuan status dan warna
  const getStatus = () => {
    if (item.ada_kerusakan) {
      return { label: 'BAHAYA', color: '#DC2626', bg: '#FEE2E2' };
    }
    if (item.terdampak) {
      return { label: 'WASPADA', color: '#D97706', bg: '#FEF3C7' };
    }
    return { label: 'AMAN', color: '#059669', bg: '#D1FAE5' };
  };

  const status = getStatus();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{item.jenis_bencana}</Text>

            {/* GANTI DOT DENGAN BADGE TEKS */}
            <View style={[styles.badge, { backgroundColor: status.bg }]}>
              <Text style={[styles.badgeText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
          </View>

          <Text style={styles.sub}>{item.unit_kerja}</Text>
          <Text style={styles.meta}>{item.created_at}</Text>
        </View>
      </View>
    </Pressable>
  );
}
