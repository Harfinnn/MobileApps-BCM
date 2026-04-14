import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/dashboard/summaryCardStyle';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  data: {
    total: number;
    aman: number;
    waspada: number;
    bahaya: number;
  };
  timeFilter: 'Hari Ini' | '7 Hari' | '30 Hari';
  loading?: boolean;
};

/* ================= COUNT UP FIX ================= */

const CountUp = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = 16;
    const increment = value / (duration / stepTime);

    const interval = setInterval(() => {
      start += increment;

      if (start >= value) {
        start = value;
        clearInterval(interval);
      }

      setDisplayValue(Math.floor(start));
    }, stepTime);

    return () => clearInterval(interval);
  }, [value]);

  return <Text>{displayValue}</Text>;
};

/* ================= SHIMMER ================= */

const Shimmer = () => {
  return (
    <View
      style={{
        height: 20,
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: '#E5E7EB',
      }}
    >
      <LinearGradient
        colors={['#E5E7EB', '#F3F4F6', '#E5E7EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

/* ================= MAIN ================= */

export default function SummaryCards({
  data,
  timeFilter,
  loading = false,
}: Props) {
  const items = [
    { label: `Total (${timeFilter})`, value: data.total },
    { label: 'Aman', value: data.aman },
    { label: 'Waspada', value: data.waspada, warning: true },
    { label: 'Bahaya', value: data.bahaya, danger: true },
  ];

  return (
    <View style={styles.container}>
      {items.map(item => (
        <View
          key={item.label}
          style={[
            styles.card,
            item.danger && styles.cardDanger,
            item.warning && { backgroundColor: '#FEF3C7' },
          ]}
        >
          {/* VALUE */}
          {loading ? (
            <Shimmer />
          ) : (
            <Text
              style={[
                styles.value,
                item.danger && styles.valueDanger,
                item.warning && { color: '#D97706' },
              ]}
            >
              <CountUp value={item.value} />
            </Text>
          )}

          {/* LABEL */}
          <Text
            style={[
              styles.label,
              item.danger && styles.labelDanger,
              item.warning && { color: '#D97706' },
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
