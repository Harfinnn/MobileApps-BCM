import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

type ImpactItem = {
  name: string;
  total: number;
};

type Props = {
  data: ImpactItem[];
  loading?: boolean;
};

const COLORS = [
  '#2563EB',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#14B8A6',
  '#F97316',
  '#EC4899',
];

export default function IncidentImpactSection({
  data,
  loading = false,
}: Props) {
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      value: item.total,
      color: COLORS[index % COLORS.length],
      text: String(item.total),
      label: item.name,
    }));
  }, [data]);

  const totalIncident = useMemo(() => {
    return data.reduce((sum, item) => sum + item.total, 0);
  }, [data]);

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Incident Impact</Text>
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Incident Impact</Text>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No impact data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Incident Impact</Text>

      <Text style={styles.subtitle}>Distribution of impacted services</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          donut
          radius={90}
          innerRadius={55}
          showText={false}
          focusOnPress
          centerLabelComponent={() => (
            <View style={styles.center}>
              <Text style={styles.total}>{totalIncident}</Text>

              <Text style={styles.totalLabel}>Incident</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendRow}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: item.color,
                },
              ]}
            />

            <Text style={styles.legendLabel} numberOfLines={1}>
              {item.label}
            </Text>

            <Text style={styles.legendValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 4,
    marginBottom: 20,
    color: '#6B7280',
    fontSize: 13,
  },

  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  total: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },

  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  legendContainer: {
    marginTop: 24,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

  legendLabel: {
    flex: 1,
    color: '#374151',
    fontSize: 14,
  },

  legendValue: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 14,
  },

  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
