import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { Clock, Layers, TrendingUp, TrendingDown } from 'lucide-react-native';

// ============================================================
// Types
// ============================================================

interface MonthlyRSD {
  bulan: string; // format: "YYYY-MM"
  durasi_hour: number;
}

interface CategoryRSD {
  category: string;
  data: MonthlyRSD[];
}

interface RSDAnalyticsCardProps {
  rsdMonthly: MonthlyRSD[];
  rsdCategory: CategoryRSD[];
}

// ============================================================
// Theme
// ============================================================

const COLORS = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E5E7EB',
  surface: '#F9FAFB',
  primary: '#2563EB',
  emerald: '#10B981',
  amber: '#F59E0B',
  purple: '#7C3AED',
  pink: '#EC4899',
  cyan: '#0EA5E9',
  orange: '#F97316',
  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#6B7280',
};

const CATEGORY_COLORS = [
  COLORS.primary,
  COLORS.emerald,
  COLORS.amber,
  COLORS.purple,
  COLORS.pink,
  COLORS.cyan,
  COLORS.orange,
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;

// ============================================================
// Helpers
// ============================================================

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatMonthLabel(bulan: string): string {
  const [, month] = bulan.split('-');
  const idx = parseInt(month, 10) - 1;
  return MONTH_LABELS[idx] ?? bulan;
}

function formatDuration(hours: number): string {
  return `${hours.toFixed(2)}h`;
}

// ============================================================
// Component
// ============================================================

type TabKey = 'overview' | 'breakdown';

export default function RSDAnalyticsCard({
  rsdMonthly,
  rsdCategory,
}: RSDAnalyticsCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    rsdCategory[0]?.category ?? null,
  );

  const trendPercent = useMemo(() => {
    if (rsdMonthly.length < 2) return 0;
    const last = rsdMonthly[rsdMonthly.length - 1].durasi_hour;
    const prev = rsdMonthly[rsdMonthly.length - 2].durasi_hour;
    if (prev === 0) return 0;
    return ((last - prev) / prev) * 100;
  }, [rsdMonthly]);

  const latestMonthly = rsdMonthly[rsdMonthly.length - 1]?.durasi_hour ?? 0;

  const lineData = useMemo(
    () =>
      rsdMonthly.map(item => ({
        value: item.durasi_hour,
        label: formatMonthLabel(item.bulan),
        dataPointText: formatDuration(item.durasi_hour),
      })),
    [rsdMonthly],
  );

  const activeCategory = useMemo(
    () => rsdCategory.find(c => c.category === selectedCategory),
    [rsdCategory, selectedCategory],
  );

  const activeCategoryColor = useMemo(() => {
    const idx = rsdCategory.findIndex(c => c.category === selectedCategory);
    return CATEGORY_COLORS[idx % CATEGORY_COLORS.length] ?? COLORS.primary;
  }, [rsdCategory, selectedCategory]);

  const barData = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.data.map(point => ({
      value: point.durasi_hour,
      label: formatMonthLabel(point.bulan),
      frontColor: activeCategoryColor,
      topLabelComponent: () => (
        <Text style={styles.barTopLabel}>
          {formatDuration(point.durasi_hour)}
        </Text>
      ),
    }));
  }, [activeCategory, activeCategoryColor]);

  const isTrendUp = trendPercent > 0;
  const isTrendFlat = trendPercent === 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <Clock size={18} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.title}>RSD Recovery</Text>
            <Text style={styles.subtitle}>
              Recovery Speed Duration analytics
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.trendBadge,
            {
              backgroundColor: isTrendFlat
                ? COLORS.surface
                : isTrendUp
                ? 'rgba(245, 158, 11, 0.12)'
                : 'rgba(16, 185, 129, 0.12)',
            },
          ]}
        >
          {!isTrendFlat &&
            (isTrendUp ? (
              <TrendingUp size={12} color={COLORS.amber} />
            ) : (
              <TrendingDown size={12} color={COLORS.emerald} />
            ))}
          <Text
            style={[
              styles.trendText,
              {
                color: isTrendFlat
                  ? COLORS.textMuted
                  : isTrendUp
                  ? COLORS.amber
                  : COLORS.emerald,
              },
            ]}
          >
            {Math.abs(trendPercent).toFixed(1)}%
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TabButton
          label="Overview"
          active={activeTab === 'overview'}
          onPress={() => setActiveTab('overview')}
        />
        <TabButton
          label="Breakdown"
          active={activeTab === 'breakdown'}
          onPress={() => setActiveTab('breakdown')}
        />
      </View>

      {activeTab === 'overview' ? (
        <View style={styles.chartWrap}>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>
              {formatDuration(latestMonthly)}
            </Text>
            <Text style={styles.statLabel}>latest month</Text>
          </View>

          <LineChart
            data={lineData}
            width={CHART_WIDTH}
            height={180}
            spacing={CHART_WIDTH / (lineData.length + 1)}
            initialSpacing={20}
            color={COLORS.primary}
            thickness={3}
            startFillColor={COLORS.primary}
            endFillColor={COLORS.bg}
            startOpacity={0.15}
            endOpacity={0}
            areaChart
            curved
            hideRules
            rulesType="solid"
            yAxisColor="transparent"
            xAxisColor={COLORS.cardBorder}
            dataPointsColor={COLORS.primary}
            dataPointsRadius={4}
            textColor={COLORS.textSecondary}
            textFontSize={10}
            textShiftY={-6}
            xAxisLabelTextStyle={{ color: COLORS.textMuted, fontSize: 11 }}
            yAxisTextStyle={{ color: COLORS.textMuted, fontSize: 10 }}
            noOfSections={4}
            isAnimated
          />
        </View>
      ) : (
        <View style={styles.chartWrap}>
          {/* Category chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipRow}
            contentContainerStyle={styles.chipRowContent}
          >
            {rsdCategory.map((cat, idx) => {
              const isActive = cat.category === selectedCategory;
              const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
              return (
                <TouchableOpacity
                  key={cat.category}
                  style={[
                    styles.chip,
                    isActive && {
                      borderColor: color,
                      backgroundColor: `${color}1A`,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.category)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.chipDot, { backgroundColor: color }]} />
                  <Text
                    style={[styles.chipText, isActive && { color }]}
                    numberOfLines={1}
                  >
                    {cat.category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {activeCategory && (
            <>
              <View style={styles.statRow}>
                <Layers size={14} color={COLORS.textMuted} />
                <Text style={styles.statValue}>
                  {formatDuration(
                    activeCategory.data[activeCategory.data.length - 1]
                      ?.durasi_hour ?? 0,
                  )}
                </Text>
                <Text style={styles.statLabel}>latest</Text>
              </View>

              <BarChart
                data={barData}
                width={CHART_WIDTH}
                height={160}
                barWidth={28}
                spacing={24}
                initialSpacing={16}
                roundedTop
                roundedBottom
                hideRules
                yAxisColor="transparent"
                xAxisColor={COLORS.cardBorder}
                xAxisLabelTextStyle={{ color: COLORS.textMuted, fontSize: 10 }}
                yAxisTextStyle={{ color: COLORS.textMuted, fontSize: 10 }}
                noOfSections={4}
                isAnimated
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}

// ============================================================
// Sub-components
// ============================================================

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[styles.tabButtonText, active && styles.tabButtonTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.6)',
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.card,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: COLORS.primary,
  },
  chartWrap: {
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  chipRow: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    width: '100%',
  },
  chipRowContent: {
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: COLORS.surface,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 140,
  },
  barTopLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
});
