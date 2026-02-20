import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/dashboard/summaryCardStyle';

type Props = {
  data: {
    hari_ini: number;
    aktif: number;
    selesai: number;
    darurat: number;
  };
};

export default function SummaryCards({ data }: Props) {
  const items = [
    { label: 'Hari Ini', value: data.hari_ini },
    { label: 'Aktif', value: data.aktif },
    { label: 'Selesai', value: data.selesai },
    { label: 'Darurat', value: data.darurat, danger: true },
  ];

  return (
    <View style={styles.container}>
      {items.map(item => (
        <View
          key={item.label}
          style={[
            styles.card,
            item.danger && styles.cardDanger,
          ]}
        >
          <Text
            style={[
              styles.value,
              item.danger && styles.valueDanger,
            ]}
          >
            {item.value}
          </Text>

          <Text
            style={[
              styles.label,
              item.danger && styles.labelDanger,
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
