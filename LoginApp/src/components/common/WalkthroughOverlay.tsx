import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  Dimensions,
  StyleSheet,
} from 'react-native';
import type { TargetRect } from '../../hooks/useWalkthrough';

const { height: SCREEN_H } = Dimensions.get('window');
const PADDING = 6;

type Props = {
  visible: boolean;
  target: TargetRect | null;
  text?: string;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
};

export default function WalkthroughOverlay({
  visible,
  target,
  text,
  isFirst,
  isLast,
  onNext,
  onPrev,
  onSkip,
}: Props) {
  if (!visible) return null;

  const t = target
    ? {
        x: target.x - PADDING,
        y: target.y - PADDING,
        width: target.width + PADDING * 2,
        height: target.height + PADDING * 2,
      }
    : null;

  const tooltipTop = t
    ? t.y + t.height + 12 + 140 > SCREEN_H
      ? Math.max(t.y - 140, 40)
      : t.y + t.height + 12
    : SCREEN_H / 2;

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
            <View
              style={[
                styles.mask,
                { top: 0, left: 0, right: 0, height: Math.max(t.y, 0) },
              ]}
            />
            <View
              style={[
                styles.mask,
                { top: t.y + t.height, left: 0, right: 0, bottom: 0 },
              ]}
            />
            <View
              style={[
                styles.mask,
                {
                  top: t.y,
                  left: 0,
                  width: Math.max(t.x, 0),
                  height: t.height,
                },
              ]}
            />
            <View
              style={[
                styles.mask,
                { top: t.y, left: t.x + t.width, right: 0, height: t.height },
              ]}
            />
            <View
              pointerEvents="none"
              style={[
                styles.highlightBorder,
                { top: t.y, left: t.x, width: t.width, height: t.height },
              ]}
            />
          </>
        ) : (
          <View style={[styles.mask, StyleSheet.absoluteFillObject]} />
        )}

        <View style={[styles.tooltip, { top: tooltipTop }]}>
          <Text style={styles.tooltipText}>{text}</Text>
          <View style={styles.row}>
            <Pressable onPress={onSkip} hitSlop={8}>
              <Text style={styles.skip}>Lewati</Text>
            </Pressable>
            <View style={styles.actions}>
              {!isFirst && (
                <Pressable onPress={onPrev} style={styles.secondaryBtn}>
                  <Text style={styles.secondaryText}>Kembali</Text>
                </Pressable>
              )}
              <Pressable onPress={onNext} style={styles.primaryBtn}>
                <Text style={styles.primaryText}>
                  {isLast ? 'Selesai' : 'Lanjut'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: { position: 'absolute', backgroundColor: 'rgba(15,23,42,0.72)' },
  highlightBorder: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00A39D',
    borderRadius: 12,
  },
  tooltip: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  tooltipText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#0F172A',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skip: { color: '#94A3B8', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8 },
  secondaryBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  secondaryText: { color: '#00A39D', fontWeight: '600', fontSize: 13 },
  primaryBtn: {
    backgroundColor: '#00A39D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
