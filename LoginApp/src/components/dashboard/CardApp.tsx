import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface ApplicationPieDataItem {
  value: number;
  color: string;
  label: string;
  [key: string]: any;
}

interface ApplicationOverviewSectionProps {
  applicationPieData: ApplicationPieDataItem[];
  onLegendItemPress?: (item: ApplicationPieDataItem) => void;
}

// ---- Hook: count-up angka total ----
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

// ---- Center label donut ----
function CenterLabel({ total }: { total: number }) {
  const animatedTotal = useCountUp(total);
  return (
    <View style={styles.centerLabelContainer}>
      <Text style={styles.centerLabelValue}>{animatedTotal}</Text>
      <Text style={styles.centerLabelText}>Total</Text>
    </View>
  );
}

// ---- Row legend: ranking + label + mini bar proporsional ----
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

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

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

export default function ApplicationOverviewSection({
  applicationPieData,
  onLegendItemPress,
}: ApplicationOverviewSectionProps) {
  const total = applicationPieData.reduce(
    (acc, curr) => acc + Number(curr.value),
    0,
  );

  console.log('=== PIE DATA ===');
  console.log(applicationPieData);

  const sorted = [...applicationPieData].sort((a, b) => b.value - a.value);
  const top = sorted[0];
  const topShare = total > 0 ? Math.round((top.value / total) * 100) : 0;
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDetails(prev => !prev);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Application Overview</Text>
      </View>

      <Animated.View
        entering={FadeInDown.duration(450).springify()}
        style={styles.card}
      >
        {/* Baris atas: donut + highlight kategori teratas */}
        <View style={styles.heroRow}>
          <View style={styles.chartWrapper}>
            <PieChart
              data={applicationPieData}
              donut
              radius={62}
              innerRadius={42}
              showText={false}
              focusOnPress
              isAnimated
              animationDuration={900}
              centerLabelComponent={() => <CenterLabel total={total} />}
            />
          </View>

          <View style={styles.highlightWrapper}>
            <View style={styles.highlightHeader}>
              <Text style={styles.highlightEyebrow}>Top category</Text>

              <Pressable
                style={styles.iconButton}
                onPress={toggleDetails}
                hitSlop={10}
              >
                {showDetails ? (
                  <Eye size={18} color="#6B7280" />
                ) : (
                  <EyeOff size={18} color="#6B7280" />
                )}
              </Pressable>
            </View>

            <View style={styles.highlightLabelRow}>
              <View
                style={[styles.legendDot, { backgroundColor: top?.color }]}
              />
              <Text style={styles.highlightLabel} numberOfLines={1}>
                {top?.label ?? '—'}
              </Text>
            </View>

            <Text style={styles.highlightShare}>{topShare}% of total</Text>
          </View>
        </View>

        {showDetails && (
          <Animated.View entering={FadeInDown.duration(250)}>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={styles.legendScroll}
              contentContainerStyle={styles.legendScrollContent}
            >
              {sorted.map((item, index) => (
                <LegendRow
                  key={item.label + index}
                  item={item}
                  index={index}
                  percentage={total > 0 ? (item.value / total) * 100 : 0}
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderTopWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.6)',
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  // --- Hero row: donut + highlight ---
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  centerLabelText: {
    fontSize: 9,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  highlightWrapper: {
    flex: 1,
    paddingLeft: 18,
  },
  highlightEyebrow: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  highlightLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  highlightLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  highlightShare: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F2F4',
    marginVertical: 16,
  },

  // --- Legend rows ---
  legendScroll: {
    maxHeight: 220,
  },
  legendScrollContent: {
    paddingRight: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  legendRank: {
    width: 22,
    fontSize: 11,
    fontWeight: '700',
    color: '#D1D5DB',
    fontVariant: ['tabular-nums'],
  },
  legendMain: {
    flex: 1,
  },
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
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
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
    backgroundColor: '#F1F2F4',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },

  highlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});
