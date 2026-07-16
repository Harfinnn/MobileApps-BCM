import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ShieldCheck, CalendarClock, Clock } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DRPSummary {
  total?: number;
  completed?: number;
  outstanding?: number;
  this_month?: number;
}

interface RSDSummary {
  total_month?: number;
  total_hour?: number;
}

interface RecoverySummaryCardProps {
  drpSummary?: DRPSummary;
  rsdSummary?: RSDSummary;
}

// ---------------------------------------------------------------------------
// Palette — light theme
// ---------------------------------------------------------------------------

const COLORS = {
  cardBg: '#FFFFFF',
  border: '#E7EAF0',
  track: '#EEF1F6',
  textPrimary: '#1A2233',
  textSecondary: '#6B7688',
  divider: '#EEF1F6',

  cyan: '#0891B2',
  cyanSoft: '#E3F6FA',
  emerald: '#059669',
  emeraldSoft: '#E3F9EF',
  amber: '#D97706',
  amberSoft: '#FDF1DF',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a decimal hour value (e.g. 15.98) into a readable "Xh Ym" string.
 * Examples: 15.98 -> "15h 59m", 2 -> "2h", 0.5 -> "30m", 0 -> "0m"
 */
function formatDuration(decimalHours: number): string {
  const totalMinutes = Math.round(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

// ---------------------------------------------------------------------------
// Komponen Animasi
// ---------------------------------------------------------------------------
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ---------------------------------------------------------------------------
// Radial progress gauge (Optimized with React.memo & Reanimated)
// ---------------------------------------------------------------------------

interface RadialGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const RadialGauge = React.memo(function RadialGauge({
  percentage,
  size = 104,
  strokeWidth = 10,
}: RadialGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));

  // Animasi nilai persentase di UI Thread
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(clamped, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, animatedProgress]);

  const animatedCircleProps = useAnimatedProps(() => {
    const dashOffset = circumference * (1 - animatedProgress.value / 100);
    return {
      strokeDashoffset: dashOffset,
    };
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.track}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.emerald}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedCircleProps}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.gaugeCenter}>
          <Text style={styles.gaugeValue}>{clamped}%</Text>
          <Text style={styles.gaugeLabel}>done</Text>
        </View>
      </View>
    </View>
  );
});

// ---------------------------------------------------------------------------
// Compact stat row (Optimized with React.memo)
// ---------------------------------------------------------------------------

interface StatRowProps {
  label: string;
  value: number;
  dotColor: string;
  delay?: number;
}

const StatRow = React.memo(function StatRow({
  label,
  value,
  dotColor,
  delay = 0,
}: StatRowProps) {
  return (
    <Animated.View
      entering={FadeInRight.delay(delay).duration(400)}
      style={styles.statRow}
    >
      <View style={styles.statRowLeft}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <Text style={styles.statRowLabel}>{label}</Text>
      </View>
      <Text style={styles.statRowValue}>{value}</Text>
    </Animated.View>
  );
});

// ---------------------------------------------------------------------------
// RSD pill (Optimized with React.memo)
// ---------------------------------------------------------------------------

interface RSDPillProps {
  label: string;
  displayValue: string;
  icon: React.ReactNode;
  tint: string;
  accent: string;
  delay?: number;
}

const RSDPill = React.memo(function RSDPill({
  label,
  displayValue,
  icon,
  tint,
  accent,
  delay = 0,
}: RSDPillProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={[styles.rsdPill, { backgroundColor: tint }]}
    >
      <View style={[styles.rsdIconWrap, { backgroundColor: '#FFFFFF' }]}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rsdValue, { color: accent }]}>{displayValue}</Text>
        <Text style={styles.rsdLabel}>{label}</Text>
      </View>
    </Animated.View>
  );
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RecoverySummaryCard({
  drpSummary,
  rsdSummary,
}: RecoverySummaryCardProps) {
  // Menggunakan useMemo agar perhitungan hanya dilakukan saat props berubah
  const stats = useMemo(() => {
    const total = drpSummary?.total ?? 0;
    const completed = drpSummary?.completed ?? 0;
    const outstanding = drpSummary?.outstanding ?? 0;
    const thisMonth = drpSummary?.this_month ?? 0;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalMonth = rsdSummary?.total_month ?? 0;
    const totalHour = rsdSummary?.total_hour ?? 0;

    return {
      total,
      completed,
      outstanding,
      thisMonth,
      completionRate,
      totalMonth,
      totalHour,
    };
  }, [drpSummary, rsdSummary]);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <ShieldCheck size={18} color={COLORS.cyan} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Recovery Summary</Text>
          <Text style={styles.headerSubtitle}>
            DRP status & recovery duration (RSD)
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <CalendarClock size={12} color={COLORS.cyan} strokeWidth={2.4} />
          <Text style={styles.headerBadgeText}>
            {stats.thisMonth} this month
          </Text>
        </View>
      </View>

      {/* DRP: gauge + breakdown */}
      <View style={styles.drpRow}>
        <RadialGauge percentage={stats.completionRate} />

        <View style={styles.statList}>
          <StatRow
            label="Total"
            value={stats.total}
            dotColor={COLORS.cyan}
            delay={100}
          />
          <StatRow
            label="Completed"
            value={stats.completed}
            dotColor={COLORS.emerald}
            delay={150}
          />
          <StatRow
            label="Outstanding"
            value={stats.outstanding}
            dotColor={COLORS.amber}
            delay={200}
          />
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* RSD row */}
      <View style={styles.rsdSectionLabel}>
        <Clock size={13} color={COLORS.textSecondary} strokeWidth={2.2} />
        <Text style={styles.rsdSectionLabelText}>
          Recovery Service Duration
        </Text>
      </View>

      <View style={styles.rsdRow}>
        <RSDPill
          label="Month"
          displayValue={`${stats.totalMonth}`}
          icon={
            <CalendarClock size={15} color={COLORS.emerald} strokeWidth={2.2} />
          }
          tint={COLORS.emeraldSoft}
          accent={COLORS.emerald}
          delay={250}
        />
        <RSDPill
          label="Recovery Hour"
          displayValue={formatDuration(stats.totalHour)}
          icon={<Clock size={15} color={COLORS.amber} strokeWidth={2.2} />}
          tint={COLORS.amberSoft}
          accent={COLORS.amber}
          delay={350}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: COLORS.cyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.1,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cyanSoft,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: COLORS.cyan,
  },

  // DRP row: gauge + list
  drpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  gaugeCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeValue: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  gaugeLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: -1,
  },
  statList: {
    flex: 1,
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statRowLabel: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statRowValue: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 16,
  },

  // RSD section
  rsdSectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  rsdSectionLabelText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rsdRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rsdPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  rsdIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rsdValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  rsdLabel: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});
