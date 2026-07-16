import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import AnimatedNumbers from 'react-native-animated-numbers';
import { PieChart } from 'react-native-gifted-charts';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutUp,
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Eye, EyeOff } from 'lucide-react-native';

// --- Komponen yang Dianimasikan menggunakan Reanimated (UI Thread) ---
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// --- Tipe Data & Props ---
export interface ApplicationPieDataItem {
  value: number;
  color: string;
  label: string;
  [key: string]: any;
}

interface SystemDashboardProps {
  percentage: number;
  downtime: number;
  tat: number;
  minValue?: number;
  maxValue?: number;
  applicationPieData: ApplicationPieDataItem[];
  onLegendItemPress?: (item: ApplicationPieDataItem) => void;
}

type StatusKey = 'excellent' | 'good' | 'warning' | 'critical';

// --- Utility Functions ---
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(decimalHours: number): string {
  const hours = Math.floor(decimalHours);
  let minutes = Math.round((decimalHours - hours) * 60);

  let finalHours = hours;
  if (minutes === 60) {
    finalHours += 1;
    minutes = 0;
  }

  if (finalHours === 0) return `${minutes} menit`;
  if (minutes === 0) return `${finalHours} jam`;
  return `${finalHours} jam ${minutes} menit`;
}

const STATUS: Record<
  StatusKey,
  { text: string; from: string; to: string; tint: string }
> = {
  excellent: {
    text: 'Excellent',
    from: '#34D399',
    to: '#059669',
    tint: '#ECFDF5',
  },
  good: { text: 'Good', from: '#A3E635', to: '#65A30D', tint: '#F7FEE7' },
  warning: { text: 'Warning', from: '#FDBA74', to: '#EA580C', tint: '#FFF7ED' },
  critical: {
    text: 'Critical',
    from: '#FCA5A5',
    to: '#DC2626',
    tint: '#FEF2F2',
  },
};

function getStatus(percentage: number): StatusKey {
  if (percentage >= 99.9) return 'excellent';
  if (percentage >= 99) return 'good';
  if (percentage >= 95) return 'warning';
  return 'critical';
}

// --- Hook Kustom ---
const CenterLabel = React.memo(({ total }: { total: number }) => {
  return (
    <View style={styles.centerLabelContainer}>
      <AnimatedNumbers
        includeComma={false}
        animateToNumber={total}
        fontStyle={styles.centerLabelValue}
        animationDuration={800}
      />
      <Text style={styles.centerLabelText}>Total</Text>
    </View>
  );
});

const StatPill = React.memo(({ icon, label, value, color, bg, delay }: any) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(350)}
      style={styles.statPill}
    >
      <View style={[styles.statPillIcon, { backgroundColor: bg }]}>{icon}</View>
      <View style={styles.statPillTextGroup}>
        <Text style={styles.statPillLabel}>{label}</Text>
        <Text style={[styles.statPillValue, { color }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </Animated.View>
  );
});

const RankChip = React.memo(({ item, rank, share, onPress }: any) => {
  return (
    <AnimatedPressable
      entering={FadeInRight.delay(rank * 90).duration(300)}
      onPress={() => onPress?.(item)}
      style={styles.rankChip}
    >
      <Text style={styles.rankChipIndex}>{rank}</Text>
      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
      <Text style={styles.rankChipLabel} numberOfLines={1}>
        {item.label}
      </Text>
      <Text style={styles.rankChipShare}>{share}%</Text>
    </AnimatedPressable>
  );
});

const LegendRow = React.memo(({ item, index, percentage, onPress }: any) => {
  const pressScale = useSharedValue(1);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withDelay(
      300 + index * 90,
      withTiming(percentage, {
        duration: 650,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [percentage, index, barWidth]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));
  const barStyle = useAnimatedStyle(() => ({ width: `${barWidth.value}%` }));

  return (
    <AnimatedPressable
      entering={FadeInRight.delay(index * 70).duration(350)}
      onPressIn={() => (pressScale.value = withSpring(0.98))}
      onPressOut={() => (pressScale.value = withSpring(1))}
      onPress={() => onPress?.(item)}
      style={[styles.legendRow, pressStyle]}
    >
      <Text style={styles.legendRank}>
        {String(index + 1).padStart(2, '0')}
      </Text>
      <View style={styles.legendMain}>
        <View style={styles.legendTopLine}>
          <View style={styles.legendLabelGroup}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
          <Text style={styles.legendValue}>{item.value}</Text>
        </View>
        <View style={styles.barTrack}>
          <Animated.View
            style={[styles.barFill, { backgroundColor: item.color }, barStyle]}
          />
        </View>
      </View>
    </AnimatedPressable>
  );
});

const IconClock = React.memo(({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
    <Path
      d="M12 7V12L15.5 14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));

const IconBolt = React.memo(({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 3L5 14H11L10 21L19 10H13L13 3Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
));

// --- KOMPONEN UTAMA ---
export default function SystemOverviewDashboard({
  percentage,
  downtime,
  tat,
  minValue = 90,
  maxValue = 100,
  applicationPieData,
  onLegendItemPress,
}: SystemDashboardProps) {
  // Hitungan Ketersediaan
  const radius = 58;
  const strokeWidth = 11;
  const size = (radius + strokeWidth) * 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = clamp(percentage, minValue, maxValue);

  // Menggunakan useMemo agar tidak menghitung ulang saat render
  const statusKey = useMemo(() => getStatus(percentage), [percentage]);
  const status = STATUS[statusKey];

  const [intPart, decPart] = percentage.toFixed(2).split('.');
  const decimalNumber = Number(decPart);
  const [showAppDetails, setShowAppDetails] = useState(false);

  // OPTIMASI: Pindahkan logika perhitungan array ke useMemo
  const { totalApps, sortedApps, topThree, remainingCount } = useMemo(() => {
    const total = applicationPieData.reduce(
      (acc, curr) => acc + Number(curr.value),
      0,
    );
    const sorted = [...applicationPieData].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 3);
    const remaining = sorted.length - top.length;

    return {
      totalApps: total,
      sortedApps: sorted,
      topThree: top,
      remainingCount: remaining,
    };
  }, [applicationPieData]);

  // OPTIMASI: Animasi SVG dipindah ke UI Thread dengan Reanimated
  const animatedProgress = useSharedValue(minValue);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1200,
      easing: Easing.out(Easing.ease),
    });
  }, [progress, animatedProgress]);

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      animatedProgress.value,
      [minValue, maxValue],
      [circumference, 0],
    );
    return { strokeDashoffset };
  });

  // OPTIMASI: Cegah PieChart re-render karena fungsi inline
  const renderCenterLabel = useCallback(() => {
    return <CenterLabel total={totalApps} />;
  }, [totalApps]);

  const toggleDetails = useCallback(() => {
    setShowAppDetails(prev => !prev);
  }, []);

  return (
    <View style={styles.masterCard}>
      <Animated.View
        style={styles.cardInner}
        layout={LinearTransition.duration(250)}
      >
        {/* ======================================= */}
        {/* BAGIAN 1: SYSTEM AVAILABILITY (HERO)      */}
        {/* ======================================= */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.sectionTitle}>System Health</Text>
            <Text style={styles.sectionSubtitle}>
              Ketersediaan sistem real-time
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.tint }]}>
            <View style={[styles.statusDot, { backgroundColor: status.to }]} />
            <Text style={[styles.statusText, { color: status.to }]}>
              {status.text}
            </Text>
          </View>
        </View>

        <View style={styles.gaugeHero}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${center}, ${center}`}>
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#F3F4F6"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <AnimatedCircle
                cx={center}
                cy={center}
                r={radius}
                stroke={status.to}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animatedProps={animatedCircleProps}
              />
            </G>
          </Svg>
          <View style={styles.centerValue}>
            <View style={styles.percentageContainer}>
              <AnimatedNumbers
                includeComma={false}
                animateToNumber={Number(intPart)}
                fontStyle={styles.percent}
                animationDuration={1200}
              />
              <Text style={styles.percent}>,</Text>
              {decimalNumber < 10 && <Text style={styles.percent}>0</Text>}
              <AnimatedNumbers
                includeComma={false}
                animateToNumber={decimalNumber}
                fontStyle={styles.percent}
                animationDuration={1200}
              />
              <Text style={styles.percentSuffix}>%</Text>
            </View>
          </View>
        </View>

        <View style={styles.statPillRow}>
          <StatPill
            icon={<IconClock color="#EA580C" />}
            label="Downtime"
            value={formatTime(downtime)}
            color="#EA580C"
            bg="#FFF7ED"
            delay={100}
          />
          <View style={styles.pillDivider} />
          <StatPill
            icon={<IconBolt color="#2563EB" />}
            label="Avg TAT"
            value={formatTime(tat)}
            color="#2563EB"
            bg="#EFF6FF"
            delay={180}
          />
        </View>

        <View style={styles.divider} />

        {/* ======================================= */}
        {/* BAGIAN 2: APPLICATION OVERVIEW (HERO)     */}
        {/* ======================================= */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.sectionTitle}>App Distribution</Text>
            <Text style={styles.sectionSubtitle}>
              {totalApps} aplikasi terpantau
            </Text>
          </View>
          <Pressable
            style={styles.toggleButton}
            onPress={toggleDetails}
            hitSlop={8}
          >
            {showAppDetails ? (
              <EyeOff size={14} color="#6B7280" />
            ) : (
              <Eye size={14} color="#6B7280" />
            )}
            <Text style={styles.toggleButtonText}>
              {showAppDetails ? 'Ringkas' : 'Lihat Semua'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.distributionHero}>
          <View style={styles.chartWrapper}>
            <PieChart
              data={applicationPieData}
              donut
              radius={52}
              innerRadius={35}
              showText={false}
              focusOnPress
              isAnimated
              animationDuration={900}
              centerLabelComponent={renderCenterLabel}
            />
          </View>

          <View style={styles.rankChipsColumn}>
            {topThree.map((item, index) => (
              <RankChip
                key={item.label + index}
                item={item}
                rank={index + 1}
                share={
                  totalApps > 0 ? Math.round((item.value / totalApps) * 100) : 0
                }
                onPress={onLegendItemPress}
              />
            ))}
            {remainingCount > 0 && !showAppDetails && (
              <Pressable onPress={toggleDetails} hitSlop={6}>
                <Text style={styles.moreText}>
                  +{remainingCount} aplikasi lainnya
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {showAppDetails && (
          <Animated.View
            entering={FadeInDown.duration(250).springify()}
            exiting={FadeOutUp.duration(200)}
          >
            <View style={styles.innerDivider} />
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={styles.legendScroll}
              contentContainerStyle={styles.legendScrollContent}
            >
              {sortedApps.map((item, index) => (
                <LegendRow
                  key={item.label + index}
                  item={item}
                  index={index}
                  percentage={
                    totalApps > 0 ? (item.value / totalApps) * 100 : 0
                  }
                  onPress={onLegendItemPress}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#0B0F19',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardInner: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 20,
  },
  innerDivider: {
    height: 1,
    backgroundColor: '#F9FAFB',
    marginTop: 16,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  gaugeHero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  centerValue: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageContainer: { flexDirection: 'row', alignItems: 'flex-end' },
  percent: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0B0F19',
    letterSpacing: -1,
  },
  percentSuffix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 3,
    marginLeft: 2,
  },
  statPillRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FAFAFB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: 18,
    paddingVertical: 4,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statPillIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statPillTextGroup: { flex: 1 },
  statPillLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  statPillValue: { fontSize: 13, fontWeight: '800' },
  pillDivider: {
    width: 1,
    alignSelf: 'center',
    height: '70%',
    backgroundColor: '#E5E7EB',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  toggleButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  distributionHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  chartWrapper: { alignItems: 'center', justifyContent: 'center' },
  centerLabelContainer: { justifyContent: 'center', alignItems: 'center' },
  centerLabelValue: { fontSize: 18, fontWeight: '800', color: '#111827' },
  centerLabelText: {
    fontSize: 9,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rankChipsColumn: { flex: 1, gap: 8 },
  rankChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAFAFB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  rankChipIndex: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D1D5DB',
    width: 12,
  },
  rankChipLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  rankChipShare: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    fontVariant: ['tabular-nums'],
  },
  moreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    paddingLeft: 4,
    paddingTop: 2,
  },
  legendScroll: { maxHeight: 220, marginTop: 4 },
  legendScrollContent: { paddingRight: 4, paddingBottom: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  legendRank: {
    width: 22,
    fontSize: 11,
    fontWeight: '700',
    color: '#D1D5DB',
    fontVariant: ['tabular-nums'],
  },
  legendMain: { flex: 1 },
  legendTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  legendLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    flexShrink: 1,
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    fontVariant: ['tabular-nums'],
  },
  barTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 3 },
});
