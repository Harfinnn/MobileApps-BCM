import React from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from '../../styles/bencana/disasterListItemStyle';

type Props = {
  item: any;
  onPress?: () => void;
};

export default function DisasterListItem({ item, onPress }: Props) {

  const severityColor =
    item.ada_kerusakan
      ? '#DC2626'
      : item.terdampak
      ? '#F59E0B'
      : '#10B981';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: severityColor }]} />

        <View style={styles.content}>
          <Text style={styles.title}>{item.jenis_bencana}</Text>
          <Text style={styles.sub}>
            {item.unit_kerja}
          </Text>
          <Text style={styles.meta}>
            {item.created_at}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
