import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryData {
  total: number;
  internal: number;
  external: number;
  avg_duration_hour: number;
  downtime_hour: number;
}

interface Props {
  data: SummaryData | null;
}

// Palet mengikuti identitas SIMPEL BCM
const EMERALD = '#00A39D';
const NAVY = '#0F172A';
const AMBER = '#F59E0B';

export default function IncidentSummaryCard({ data }: Props) {
  if (!data) return null;

  const totalSplit = data.internal + data.external || 1;
  const internalRatio = data.internal / totalSplit;
  const externalRatio = data.external / totalSplit;

  return (
    <View style={styles.container}>
      {/* ===== Header ===== */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>Ringkasan Insiden</Text>
          <Text style={styles.subtitle}>Gambaran umum insiden BCM</Text>
        </View>
      </View>

      {/* ===== Hero: Total + split bar ===== */}
      <View style={styles.heroBlock}>
        <Text style={styles.heroValue}>{data.total}</Text>
        <Text style={styles.heroLabel}>Total insiden tercatat</Text>

        <View style={styles.segmentTrack}>
          <View
            style={[
              styles.segmentFill,
              { flex: internalRatio || 0.0001, backgroundColor: EMERALD },
            ]}
          />
          <View
            style={[
              styles.segmentFill,
              { flex: externalRatio || 0.0001, backgroundColor: AMBER },
            ]}
          />
        </View>

        <View style={styles.segmentLegendRow}>
          <View style={styles.segmentLegendItem}>
            <View
              style={[styles.legendDotSmall, { backgroundColor: EMERALD }]}
            />
            <Text style={styles.segmentLegendText}>
              Internal · {data.internal}
            </Text>
          </View>
          <View style={styles.segmentLegendItem}>
            <View style={[styles.legendDotSmall, { backgroundColor: AMBER }]} />
            <Text style={styles.segmentLegendText}>
              Eksternal · {data.external}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E7EAF0',
    padding: 18,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    marginBottom: 24,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#E6F7F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconBadgeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: EMERALD,
  },

  header: {
    fontSize: 17,
    fontWeight: '700',
    color: NAVY,
  },

  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },

  heroBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 18,
  },

  heroValue: {
    fontSize: 34,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: -0.5,
  },

  heroLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 14,
  },

  segmentTrack: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },

  segmentFill: {
    height: '100%',
  },

  segmentLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  segmentLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  segmentLegendText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
