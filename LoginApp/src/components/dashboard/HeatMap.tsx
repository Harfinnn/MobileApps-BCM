import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import API from '../../services/api'; // TODO: sesuaikan path sesuai struktur project kamu

// ============================================================
// Types — mengikuti response dari RiskHeatmapService::generate()
// ============================================================

interface RiskItem {
  application: string;
  category: string;
  category_code: string;
  incident: number;
  impact: number; // 1-5
  likelihood: number; // 1-5
  risk_score: number; // impact * likelihood
  color: string;
}

interface RiskHeatmapResponse {
  tahun: number;
  matrix: RiskItem[];
}

// ============================================================
// Skema warna — konvensi standar risk matrix (hijau → merah/ungu)
// Selaras dengan threshold riskColor() di backend (skor = impact × likelihood)
// ============================================================

type RiskTier = {
  label: string;
  min: number;
  cellBg: string; // warna sel di grid (soft, biar angka tetap kebaca)
  solid: string; // warna badge/legend (pekat)
  textOnCell: string;
};

const RISK_TIERS: RiskTier[] = [
  {
    label: 'Extreme',
    min: 20,
    cellBg: '#E9D5FF',
    solid: '#7C3AED',
    textOnCell: '#5B21B6',
  },
  {
    label: 'High',
    min: 15,
    cellBg: '#FECACA',
    solid: '#DC2626',
    textOnCell: '#991B1B',
  },
  {
    label: 'Medium',
    min: 10,
    cellBg: '#FED7AA',
    solid: '#EA580C',
    textOnCell: '#9A3412',
  },
  {
    label: 'Low-Medium',
    min: 5,
    cellBg: '#FEF08A',
    solid: '#CA8A04',
    textOnCell: '#854D0E',
  },
  {
    label: 'Low',
    min: 0,
    cellBg: '#BBF7D0',
    solid: '#16A34A',
    textOnCell: '#166534',
  },
];

function getTier(score: number): RiskTier {
  return (
    RISK_TIERS.find(tier => score >= tier.min) ??
    RISK_TIERS[RISK_TIERS.length - 1]
  );
}

// ============================================================
// Helpers
// ============================================================

/** Kelompokkan aplikasi berdasarkan koordinat (likelihood, impact) yang sama. */
function groupByCoordinate(items: RiskItem[]): Map<string, RiskItem[]> {
  const map = new Map<string, RiskItem[]>();
  for (const item of items) {
    const key = `${item.likelihood}-${item.impact}`;
    const bucket = map.get(key) ?? [];
    bucket.push(item);
    map.set(key, bucket);
  }
  return map;
}

const GRID_SIZE = 5;

// ============================================================
// Component
// ============================================================

interface Props {
  tahun?: number;
}

export default function RiskHeatmapMatrix({
  tahun = new Date().getFullYear(),
}: Props) {
  const [data, setData] = useState<RiskHeatmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<RiskItem[] | null>(null);

  const fetchHeatmap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get<RiskHeatmapResponse>('/risk-heatmap', {
        params: { tahun },
      });
      setData(res.data);
    } catch (err) {
      // 401/403 sudah auto-handled oleh interceptor di api.ts (auto logout),
      // di sini cukup tangani kegagalan network/response lain
      setError('Gagal memuat data risk heatmap. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [tahun]);

  useEffect(() => {
    fetchHeatmap();
  }, [fetchHeatmap]);

  const grouped = useMemo(
    () => (data ? groupByCoordinate(data.matrix) : new Map()),
    [data],
  );

  if (loading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator color="#0891B2" size="large" />
        <Text style={styles.stateText}>Memuat risk heatmap…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchHeatmap}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  if (!data || data.matrix.length === 0) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.stateText}>
          Tidak ada insiden tercatat untuk tahun {tahun}.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Risk Heatmap</Text>
        <View style={styles.yearBadge}>
          <Text style={styles.yearBadgeText}>{data.tahun}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Impact × Likelihood per Aplikasi</Text>

      {/* Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.gridWithAxis}>
            {/* Label sumbu Impact (kiri) */}
            <View style={styles.impactAxis}>
              {[5, 4, 3, 2, 1].map(impact => (
                <View key={impact} style={styles.axisCell}>
                  <Text style={styles.axisLabel}>{impact}</Text>
                </View>
              ))}
            </View>

            {/* Baris-baris grid */}
            <View>
              {[5, 4, 3, 2, 1].map(impact => (
                <View key={impact} style={styles.gridRow}>
                  {Array.from({ length: GRID_SIZE }, (_, i) => i + 1).map(
                    likelihood => {
                      const key = `${likelihood}-${impact}`;
                      const items = grouped.get(key) ?? [];
                      const score = impact * likelihood;
                      const tier = getTier(score);
                      const hasData = items.length > 0;

                      return (
                        <Pressable
                          key={key}
                          disabled={!hasData}
                          onPress={() => setSelectedCell(items)}
                          style={[
                            styles.gridCell,
                            { backgroundColor: tier.cellBg },
                          ]}
                        >
                          {hasData && (
                            <>
                              <Text
                                style={[
                                  styles.cellCount,
                                  { color: tier.textOnCell },
                                ]}
                              >
                                {items.length}
                              </Text>
                              <Text
                                style={[
                                  styles.cellCaption,
                                  { color: tier.textOnCell },
                                ]}
                              >
                                aplikasi
                              </Text>
                            </>
                          )}
                        </Pressable>
                      );
                    },
                  )}
                </View>
              ))}

              {/* Label sumbu Likelihood (bawah) */}
              <View style={styles.gridRow}>
                {[1, 2, 3, 4, 5].map(likelihood => (
                  <View key={likelihood} style={styles.axisCellBottom}>
                    <Text style={styles.axisLabel}>{likelihood}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.axisTitles}>
            <Text style={styles.axisTitleText}>
              ↑ Impact (kiri) · Likelihood (bawah) →
            </Text>
          </View>
        </View>
      </ScrollView>

      <Text style={styles.hintText}>
        Ketuk sel untuk melihat daftar aplikasi
      </Text>

      {/* Legend */}
      <View style={styles.legendRow}>
        {RISK_TIERS.map(tier => (
          <View key={tier.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: tier.solid }]} />
            <Text style={styles.legendText}>{tier.label}</Text>
          </View>
        ))}
      </View>

      {/* Top risk list */}
      <Text style={styles.sectionLabel}>Top Risiko</Text>
      {data.matrix.slice(0, 5).map(item => {
        const tier = getTier(item.risk_score);
        return (
          <Pressable
            key={item.application}
            style={styles.listRow}
            onPress={() => setSelectedCell([item])}
          >
            <View
              style={[styles.listScoreBadge, { backgroundColor: tier.solid }]}
            >
              <Text style={styles.listScoreText}>{item.risk_score}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listApp}>{item.application}</Text>
              <Text style={styles.listMeta}>
                {item.category} · {item.incident} insiden
              </Text>
            </View>
          </Pressable>
        );
      })}

      {/* Detail modal */}
      <Modal
        visible={!!selectedCell}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCell(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectedCell(null)}
        >
          <Pressable
            style={styles.modalCard}
            onPress={e => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Detail Risiko</Text>
            <ScrollView>
              {selectedCell?.map(item => {
                const tier = getTier(item.risk_score);
                return (
                  <View key={item.application} style={styles.modalItem}>
                    <View style={styles.modalItemHeader}>
                      <Text style={styles.modalApp}>{item.application}</Text>
                      <View
                        style={[
                          styles.modalScoreBadge,
                          { backgroundColor: tier.solid },
                        ]}
                      >
                        <Text style={styles.modalScoreText}>
                          {item.risk_score}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.modalDetail}>
                      Kategori: {item.category}
                    </Text>
                    <Text style={styles.modalDetail}>
                      Jumlah insiden: {item.incident}
                    </Text>
                    <Text style={styles.modalDetail}>
                      Impact {item.impact} × Likelihood {item.likelihood}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setSelectedCell(null)}
            >
              <Text style={styles.modalCloseText}>Tutup</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ============================================================
// Styles — tema terang, netral, fokus ke keterbacaan grid
// ============================================================

const CELL_SIZE = 56;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  centerState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stateText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0891B2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
  },
  yearBadge: {
    backgroundColor: '#ECFEFF',
    borderWidth: 1,
    borderColor: '#0891B2',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  yearBadgeText: {
    color: '#0891B2',
    fontSize: 12,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
  },
  gridWithAxis: {
    flexDirection: 'row',
  },
  impactAxis: {
    justifyContent: 'flex-start',
  },
  axisCell: {
    width: 28,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  axisCellBottom: {
    width: CELL_SIZE,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  axisLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  cellCount: {
    fontSize: 16,
    fontWeight: '800',
  },
  cellCaption: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: -2,
  },
  axisTitles: {
    marginTop: 6,
    paddingLeft: 28,
  },
  axisTitleText: {
    color: '#94A3B8',
    fontSize: 10.5,
  },
  hintText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 10,
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionLabel: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  listScoreBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listScoreText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  listApp: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
  },
  listMeta: {
    color: '#64748B',
    fontSize: 11.5,
    marginTop: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  modalItem: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalApp: {
    color: '#0F172A',
    fontSize: 14.5,
    fontWeight: '700',
    flex: 1,
  },
  modalScoreBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  modalScoreText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  modalDetail: {
    color: '#64748B',
    fontSize: 12.5,
    marginTop: 2,
  },
  modalCloseButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  modalCloseText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
  },
});
