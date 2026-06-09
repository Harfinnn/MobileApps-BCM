import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AlertTriangle, X, ArrowRight } from 'lucide-react-native';

interface TsunamiWarningCardProps {
  magnitude: string;
  area: string;
  potential: string;
  sent: string;
  onPress: () => void;
  onClose: () => void;
}

const TsunamiWarningCard = ({
  magnitude,
  area,
  potential,
  sent,
  onPress,
  onClose,
}: TsunamiWarningCardProps) => {
  return (
    <View style={styles.cardContainer}>
      {/* Kolom Kiri: Indikator Magnitudo Besar */}
      <View style={styles.leftColumn}>
        <Text style={styles.magLabel}>MAG</Text>
        <Text style={styles.magValue}>{magnitude}</Text>
      </View>

      {/* Kolom Kanan: Konten Informasi */}
      <View style={styles.rightColumn}>
        {/* Baris Atas: Status & Tombol Close */}
        <View style={styles.cardHeader}>
          <View style={styles.badge}>
            <AlertTriangle size={12} color="#EF4444" strokeWidth={2.5} />
            <Text style={styles.badgeText}>PERINGATAN TSUNAMI</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={16} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Baris Tengah: Informasi Wilayah & Potensi */}
        <Text style={styles.areaText} numberOfLines={2}>
          {area}
        </Text>
        <Text style={styles.potentialText}>{potential}</Text>

        {/* Baris Bawah: Waktu & Tombol Aksi */}
        <View style={styles.cardFooter}>
          <Text style={styles.timeText}>{sent}</Text>
          <Pressable onPress={onPress} style={styles.actionButton}>
            <Text style={styles.actionText}>Detail</Text>
            <ArrowRight size={14} color="#EF4444" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flexDirection: 'row',
    // Ultra soft shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  leftColumn: {
    backgroundColor: '#FEF2F2',
    width: 85,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#FEE2E2',
    padding: 12,
  },
  magLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 1.5,
    marginBottom: -2,
  },
  magValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#EF4444',
  },
  rightColumn: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DF1C1C',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 2,
  },
  areaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 4,
  },
  potentialText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#DC2626',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
});

export default React.memo(TsunamiWarningCard);
