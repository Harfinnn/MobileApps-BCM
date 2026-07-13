import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';
import AnimatedNumbers from 'react-native-animated-numbers';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  percentage: number;
  downtime: number;
  tat: number;
  minValue?: number;
  maxValue?: number;
}

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

type StatusKey = 'excellent' | 'good' | 'warning' | 'critical';

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

function IconClock({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
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
}

function IconBolt({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 3L5 14H11L10 21L19 10H13L13 3Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function AvailabilityGauge({
  percentage,
  downtime,
  tat,
  minValue = 90,
  maxValue = 100,
}: Props) {
  const radius = 54;
  const strokeWidth = 12;
  const size = (radius + strokeWidth) * 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = clamp(percentage, minValue, maxValue);
  const statusKey = getStatus(percentage);
  const status = STATUS[statusKey];

  const animatedValue = useRef(new Animated.Value(minValue)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [minValue, maxValue],
    outputRange: [circumference, 0],
  });

  // Trik memecah desimal menjadi dua bagian
  const [intPart, decPart] = percentage.toFixed(2).split('.');
  const decimalNumber = Number(decPart);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SYSTEM AVAILABILITY</Text>
        <View style={[styles.statusBadge, { backgroundColor: status.tint }]}>
          <View style={[styles.statusDot, { backgroundColor: status.to }]} />
          <Text style={[styles.status, { color: status.to }]}>
            {status.text}
          </Text>
        </View>
      </View>

      <View style={styles.bentoGrid}>
        <Pressable
          style={({ pressed }) => [
            styles.mainGaugeCard,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.svgContainer}>
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
                {/* Bagian Bulat (Misal: 99) */}
                <AnimatedNumbers
                  includeComma={false}
                  animateToNumber={Number(intPart)}
                  fontStyle={styles.percent}
                  animationDuration={1200}
                />

                {/* Pemisah Koma Manual */}
                <Text style={styles.percent}>,</Text>

                {/* Proteksi angka nol jika desimal di bawah 10 (misal 99,05) */}
                {decimalNumber < 10 && <Text style={styles.percent}>0</Text>}

                {/* Bagian Desimal (Misal: 32) */}
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
        </Pressable>

        <View style={styles.statsColumn}>
          <Pressable
            style={({ pressed }) => [
              styles.bentoCard,
              { backgroundColor: '#FFF7ED' },
              pressed && styles.cardPressed,
            ]}
          >
            <View style={styles.bentoHeaderRow}>
              <Text style={styles.bentoLabel}>Downtime</Text>
            </View>
            <Text
              style={[styles.bentoValue, { color: '#EA580C' }]}
              numberOfLines={2}
            >
              {formatTime(downtime)}
            </Text>
          </Pressable>

          <View style={styles.microRow}>
            <Pressable
              style={({ pressed }) => [
                styles.microCard,
                { backgroundColor: '#EFF6FF' },
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.microHeaderRow}>
                <Text style={styles.microLabel}>Avg TAT</Text>
              </View>
              <Text
                style={[styles.microValue, { color: '#2563EB' }]}
                numberOfLines={2}
              >
                {formatTime(tat)}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#0B0F19',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1.2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  mainGaugeCard: {
    flex: 1.1,
    backgroundColor: '#FAFAFB',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Memastikan tanda % sejajar dengan teks di bawah
  },
  percent: {
    fontSize: 26, // Disesuaikan sedikit agar tidak bertabrakan saat 4 digit animasi
    fontWeight: '800',
    color: '#0B0F19',
    letterSpacing: -1,
  },
  percentSuffix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 2,
  },
  statsColumn: {
    flex: 1,
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
  },
  bentoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  bentoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  bentoValue: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  microRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  microCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
  },
  microHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  microValue: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  microLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});
