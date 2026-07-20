import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

interface SummaryData {
  total: number;
  internal: number;
  external: number;
  avg_duration_hour: number;
  downtime_hour: number;
}

type ImpactItem = {
  name: string;
  total: number;
};

interface Props {
  data: SummaryData | null;
  impactData: ImpactItem[];
  loading?: boolean;
}

// Palet mengikuti identitas SIMPEL BCM
const EMERALD = '#00A39D';
const TEAL = '#2DD4BF';
const NAVY = '#0F172A';
const AMBER = '#F59E0B';
const RED = '#F43F5E';
const PURPLE = '#8B5CF6';

const CHART_COLORS = [
  EMERALD,
  TEAL,
  AMBER,
  PURPLE,
  RED,
  '#3B82F6',
  '#EC4899',
  '#84CC16',
];

const MetricPill = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <View style={styles.pill}>
    <View style={[styles.pillDot, { backgroundColor: color }]} />
    <View>
      <Text style={styles.pillValue}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  </View>
);

export default function IncidentOverviewCard({
  data,
  impactData,
  loading = false,
}: Props) {
  const chartData = useMemo(
    () =>
      impactData.map((item, index) => ({
        value: item.total,
        color: CHART_COLORS[index % CHART_COLORS.length],
        text: String(item.total),
        label: item.name,
      })),
    [impactData],
  );

  const totalIncident = useMemo(
    () => impactData.reduce((sum, item) => sum + item.total, 0),
    [impactData],
  );

  if (!data) return null;

  const totalSplit = data.internal + data.external || 1;
  const internalRatio = data.internal / totalSplit;
  const externalRatio = data.external / totalSplit;

  return (
    <View style={styles.container}>
      {/* ===== Header ===== */}
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <View style={styles.iconBadgeDot} />
        </View>
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

      {/* ===== Eyebrow divider ===== */}
      <View style={styles.eyebrowRow}>
        <Text style={styles.eyebrow}>DISTRIBUSI DAMPAK</Text>
        <View style={styles.eyebrowLine} />
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Memuat data...</Text>
      ) : !impactData.length ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCircle} />
          <Text style={styles.emptyText}>Belum ada data dampak insiden</Text>
        </View>
      ) : (
        <>
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              donut
              radius={82}
              innerRadius={52}
              showText={false}
              focusOnPress
              centerLabelComponent={() => (
                <View style={styles.center}>
                  <Text style={styles.total}>{totalIncident}</Text>
                  <Text style={styles.totalLabel}>Insiden</Text>
                </View>
              )}
            />
          </View>

          <View style={styles.legendContainer}>
            {chartData.map((item, index) => {
              const pct = totalIncident
                ? Math.round((item.value / totalIncident) * 100)
                : 0;
              return (
                <View key={index} style={styles.legendRow}>
                  <View style={styles.legendTopRow}>
                    <View style={styles.legendLabelWrap}>
                      <View
                        style={[
                          styles.legendDotSmall,
                          { backgroundColor: item.color },
                        ]}
                      />
                      <Text style={styles.legendLabel} numberOfLines={1}>
                        {item.label}
                      </Text>
                    </View>
                    <Text style={styles.legendValue}>{item.value}</Text>
                  </View>
                  <View style={styles.legendBarTrack}>
                    <View
                      style={[
                        styles.legendBarFill,
                        { width: `${pct}%`, backgroundColor: item.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
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
    marginBottom: 14,
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

  segmentLegendText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  pillRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },

  pillValue: {
    fontSize: 15,
    fontWeight: '700',
    color: NAVY,
  },

  pillLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    marginRight: 10,
  },

  eyebrowLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },

  loadingText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 20,
  },

  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  total: {
    fontSize: 24,
    fontWeight: '800',
    color: NAVY,
  },

  totalLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },

  legendContainer: {
    gap: 14,
  },

  legendRow: {
    gap: 6,
  },

  legendTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  legendLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  legendDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  legendLabel: {
    flex: 1,
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },

  legendValue: {
    fontWeight: '700',
    color: NAVY,
    fontSize: 13,
  },

  legendBarTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },

  legendBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  emptyContainer: {
    paddingVertical: 36,
    alignItems: 'center',
  },

  emptyCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
  },

  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
  },
});
