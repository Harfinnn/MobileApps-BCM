import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated as RNAnimated, // Alias untuk mencegah bentrok
} from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import AnimatedNumbers from 'react-native-animated-numbers';
import { PieChart } from 'react-native-gifted-charts';
import Animated, { // Reanimated
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Eye, EyeOff } from 'lucide-react-native';

// --- Konfigurasi LayoutAnimation Android ---
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Komponen yang Dianimasikan ---
const AnimatedCircle = RNAnimated.createAnimatedComponent(Circle);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// --- Tipe Data & Props ---
export interface ApplicationPieDataItem {
  value: number;
  color: string;
  label: string;
  [key: string]: any;
}

interface SystemDashboardProps {
  // Props Availability
  percentage: number;
  downtime: number;
  tat: number;
  minValue?: number;
  maxValue?: number;
  // Props Application Overview
  applicationPieData: ApplicationPieDataItem[];
  onLegendItemPress?: (item: ApplicationPieDataItem) => void;
}

type StatusKey = 'excellent' | 'good' | 'warning' | 'critical';

// --- Utility Functions (TIDAK DIUBAH) ---
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

// --- Hook Kustom (TIDAK DIUBAH) ---
function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let frame: number;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

// --- Sub-Komponen ---
function CenterLabel({ total }: { total: number }) {
  const animatedTotal = useCountUp(total);
  return (
    <View style={styles.centerLabelContainer}>
      <Text style={styles.centerLabelValue}>{animatedTotal}</Text>
      <Text style={styles.centerLabelText}>Total</Text>
    </View>
  );
}

// Pill statistik horizontal (pengganti 2 kartu berwarna yang ditumpuk)
function StatPill({
  icon,
  label,
  value,
  color,
  bg,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bg: string;
  delay: number;
}) {
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
}

// Chip ranking ringkas untuk 3 aplikasi teratas (selalu terlihat, tanpa toggle)
function RankChip({
  item,
  rank,
  share,
  onPress,
}: {
  item: ApplicationPieDataItem;
  rank: number;
  share: number;
  onPress?: (item: ApplicationPieDataItem) => void;
}) {
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
}

function LegendRow({
  item,
  index,
  percentage,
  onPress,
}: {
  item: ApplicationPieDataItem;
  index: number;
  percentage: number;
  onPress?: (item: ApplicationPieDataItem) => void;
}) {
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
  }, [percentage]);

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
}

// Icon SVG Minimalis
const IconClock = ({ color }: { color: string }) => (
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
);
const IconBolt = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 3L5 14H11L10 21L19 10H13L13 3Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

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
  const statusKey = getStatus(percentage);
  const status = STATUS[statusKey];

  const animatedValue = useRef(new RNAnimated.Value(minValue)).current;
  const [intPart, decPart] = percentage.toFixed(2).split('.');
  const decimalNumber = Number(decPart);

  // Hitungan Aplikasi
  const totalApps = applicationPieData.reduce(
    (acc, curr) => acc + Number(curr.value),
    0,
  );
  const sortedApps = [...applicationPieData].sort((a, b) => b.value - a.value);
  const topThree = sortedApps.slice(0, 3);
  const remainingCount = sortedApps.length - topThree.length;
  const [showAppDetails, setShowAppDetails] = useState(false);

  useEffect(() => {
    RNAnimated.timing(animatedValue, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [minValue, maxValue],
    outputRange: [circumference, 0],
  });

  const toggleDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAppDetails(prev => !prev);
  };

  return (
    <View style={styles.masterCard}>
      {/* Aksen tipis di atas kartu, warnanya mengikuti status kesehatan sistem */}

      <View style={styles.cardInner}>
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

        {/* Gauge sebagai centerpiece tunggal, bukan bagian dari grid kotak */}
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
                strokeDashoffset={strokeDashoffset}
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

        {/* Pill statistik horizontal, menggantikan 2 kartu berwarna yang ditumpuk */}
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

        {/* Pembatas Elegan */}
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

        {/* Donut + ranking top 3 berdampingan, keduanya langsung terlihat tanpa toggle */}
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
              centerLabelComponent={() => <CenterLabel total={totalApps} />}
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
          <Animated.View entering={FadeInDown.duration(250).springify()}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Global Card Style
  masterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
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
  topAccent: {
    height: 4,
    width: '100%',
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

  // Status Badge (Health)
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },

  // Gauge Hero (centerpiece tunggal, bukan bento grid)
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

  // Stat Pill Row (pengganti 2 kartu berwarna yang ditumpuk vertikal)
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

  // Toggle button (pengganti icon-only button)
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

  // Application Distribution Hero
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

  // Rank chips (top 3 selalu terlihat, menggantikan single highlight text)
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

  // Legends (daftar lengkap, muncul saat "Lihat Semua" ditekan)
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
