import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { ArrowRight, X } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { TargetRect } from '../../hooks/useWalkthrough';

const { height: SCREEN_H } = Dimensions.get('window');
const PADDING = 6;
const TOOLTIP_HEIGHT_EST = 160;

const TIMING = { duration: 280, easing: Easing.out(Easing.cubic) };

type Props = {
  visible: boolean;
  target: TargetRect | null;
  text?: string;
  stepIndex: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  tooltipOffsetY?: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
};

export default function WalkthroughOverlay({
  visible,
  target,
  text,
  stepIndex,
  totalSteps,
  isFirst,
  isLast,
  tooltipOffsetY = 0,
  onNext,
  onPrev,
  onSkip,
}: Props) {
  const rectX = useSharedValue(0);
  const rectY = useSharedValue(0);
  const rectW = useSharedValue(0);
  const rectH = useSharedValue(0);
  const rectOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);

  const t = target
    ? {
        x: target.x - PADDING,
        y: target.y - PADDING,
        width: target.width + PADDING * 2,
        height: target.height + PADDING * 2,
      }
    : null;

  useEffect(() => {
    if (t) {
      rectX.value = withTiming(t.x, TIMING);
      rectY.value = withTiming(t.y, TIMING);
      rectW.value = withTiming(t.width, TIMING);
      rectH.value = withTiming(t.height, TIMING);
      rectOpacity.value = withTiming(1, TIMING);
    } else {
      rectOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [t?.x, t?.y, t?.width, t?.height]);

  useEffect(() => {
    cardOpacity.value = 0;
    cardOpacity.value = withTiming(1, { duration: 220 });
  }, [stepIndex]);

  const topMaskStyle = useAnimatedStyle(() => ({
    top: 0,
    left: 0,
    right: 0,
    height: Math.max(rectY.value, 0),
    opacity: rectOpacity.value,
  }));
  const bottomMaskStyle = useAnimatedStyle(() => ({
    top: rectY.value + rectH.value,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: rectOpacity.value,
  }));
  const leftMaskStyle = useAnimatedStyle(() => ({
    top: rectY.value,
    left: 0,
    width: Math.max(rectX.value, 0),
    height: rectH.value,
    opacity: rectOpacity.value,
  }));
  const rightMaskStyle = useAnimatedStyle(() => ({
    top: rectY.value,
    left: rectX.value + rectW.value,
    right: 0,
    height: rectH.value,
    opacity: rectOpacity.value,
  }));
  const borderStyle = useAnimatedStyle(() => ({
    top: rectY.value,
    left: rectX.value,
    width: rectW.value,
    height: rectH.value,
    opacity: rectOpacity.value,
  }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: (1 - cardOpacity.value) * 8 }],
  }));

  if (!visible) return null;

  // 🔥 pakai bagian target yang benar-benar terlihat di layar, bukan tinggi aslinya
  const visibleTop = t ? Math.max(t.y, 0) : 0;
  const visibleBottom = t ? Math.min(t.y + t.height, SCREEN_H) : 0;

  const spaceAbove = visibleTop;
  const spaceBelow = SCREEN_H - visibleBottom;

  // taruh tooltip di sisi yang ruang kosongnya lebih besar
  const placeAbove = t ? spaceAbove > spaceBelow + 40 : false;

  const tooltipTop =
    (t
      ? placeAbove
        ? Math.max(visibleTop - TOOLTIP_HEIGHT_EST - 12, 50)
        : Math.min(visibleBottom + 20, SCREEN_H - TOOLTIP_HEIGHT_EST - 30)
      : SCREEN_H / 2 - TOOLTIP_HEIGHT_EST / 2) + tooltipOffsetY;

  const arrowTop = placeAbove ? undefined : -8;
  const arrowBottom = placeAbove ? -8 : undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onSkip}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {t ? (
          <>
            <Animated.View style={[styles.mask, topMaskStyle]} />
            <Animated.View style={[styles.mask, bottomMaskStyle]} />
            <Animated.View style={[styles.mask, leftMaskStyle]} />
            <Animated.View style={[styles.mask, rightMaskStyle]} />
            <Animated.View
              pointerEvents="none"
              style={[styles.highlightBorder, borderStyle]}
            />
          </>
        ) : (
          <View style={[styles.mask, StyleSheet.absoluteFillObject]} />
        )}

        <Animated.View style={[styles.tooltip, cardStyle, { top: tooltipTop }]}>
          {t && (
            <View
              style={[
                styles.arrow,
                { left: Math.min(Math.max(t.x + t.width / 2 - 28, 20), 260) },
                arrowTop !== undefined && { top: arrowTop },
                arrowBottom !== undefined && {
                  bottom: arrowBottom,
                  transform: [{ rotate: '180deg' }],
                },
              ]}
            />
          )}

          <View style={styles.headerRow}>
            <Text style={styles.stepCounter}>
              {stepIndex + 1} / {totalSteps}
            </Text>
            <Pressable onPress={onSkip} hitSlop={8} style={styles.closeBtn}>
              <X size={16} color="#94A3B8" />
            </Pressable>
          </View>

          <Text style={styles.tooltipText}>{text}</Text>

          <View style={styles.progressRow}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === stepIndex && styles.dotActive]}
              />
            ))}
          </View>

          <View style={styles.row}>
            {!isFirst ? (
              <Pressable onPress={onPrev} style={styles.secondaryBtn}>
                <Text style={styles.secondaryText}>Kembali</Text>
              </Pressable>
            ) : (
              <View />
            )}

            <Pressable onPress={onNext} style={styles.primaryBtn}>
              <Text style={styles.primaryText}>
                {isLast ? 'Selesai' : 'Lanjut'}
              </Text>
              {!isLast && (
                <ArrowRight size={15} color="#fff" style={{ marginLeft: 6 }} />
              )}
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: { position: 'absolute', backgroundColor: 'rgba(15,23,42,0.75)' },
  highlightBorder: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#00A39D',
    borderRadius: 14,
    backgroundColor: 'transparent', // 🔥 tambahkan ini — wajib eksplisit di Android
    ...Platform.select({
      ios: {
        shadowColor: '#00A39D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {}, // 🔥 elevation dibuang khusus Android, penyebab kotak putih
    }),
  },
  tooltip: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00A39D',
    backgroundColor: 'rgba(0,163,157,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  closeBtn: { padding: 2 },
  tooltipText: {
    fontSize: 14.5,
    lineHeight: 21,
    color: '#0F172A',
    marginBottom: 14,
  },
  progressRow: { flexDirection: 'row', gap: 5, marginBottom: 16 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' },
  dotActive: { width: 16, backgroundColor: '#00A39D' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryBtn: { paddingVertical: 10, paddingHorizontal: 4 },
  secondaryText: { color: '#64748B', fontWeight: '600', fontSize: 13.5 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A39D',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 'auto',
    shadowColor: '#00A39D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 13.5 },
});
