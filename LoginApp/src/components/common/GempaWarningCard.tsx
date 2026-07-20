import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';

type GempaCardProps = {
  Magnitude: string;
  Wilayah: string;
  Jam: string;
  Tanggal?: string;
  Kedalaman?: string;
  onPress: () => void;
  onClose: () => void;
};

export const GempaWarningCard = ({
  Magnitude,
  Wilayah,
  Jam,
  Tanggal,
  Kedalaman,
  onPress,
  onClose,
}: GempaCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardGempa,
        pressed && styles.cardGempaPressed,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.badgeGempa}>
          <AlertCircle size={13} color="#FFF" />
          <Text style={styles.badgeText}>GEMPA TERKINI</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={10} style={styles.closeButton}>
          <X size={16} color="#A0AEC0" />
        </Pressable>
      </View>

      <View style={styles.bodyGempa}>
        <View style={styles.magBox}>
          <Text style={styles.magText}>{Magnitude}</Text>
          <Text style={styles.magSub}>MAGNITUDO</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoBox}>
          <Text style={styles.wilayahText} numberOfLines={2}>
            {Wilayah}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              🕒 {Tanggal ? `${Tanggal} • ${Jam}` : Jam}
            </Text>

            {Kedalaman ? (
              <Text style={styles.metaText}>📉 {Kedalaman}</Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardGempa: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardGempaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeGempa: {
    flexDirection: 'row',
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.4,
  },
  closeButton: {
    padding: 2,
  },
  bodyGempa: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  magBox: {
    backgroundColor: '#FFF1F1',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  magText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E53935',
    lineHeight: 24,
  },
  magSub: {
    fontSize: 8,
    color: '#E53935',
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#EDF2F7',
    marginHorizontal: 12,
  },
  infoBox: {
    flex: 1,
  },
  wilayahText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A202C',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 12,
  },
  metaText: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '500',
  },
});

export default GempaWarningCard;
