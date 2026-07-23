import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  ScrollView,
} from 'react-native';
import {
  IncidentItem,
  formatTanggal,
  decodeHtmlText,
} from '../../utils/incident';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SummaryData {
  total: number;
  internal: number;
  external: number;
  avg_duration_hour: number;
  downtime_hour: number;
}

interface Props {
  data: SummaryData | null;
  incidents?: IncidentItem[] | null;
}

const EMERALD = '#00A39D';
const NAVY = '#0F172A';
const AMBER = '#F59E0B';
const PAGE_SIZE = 5;

export default function IncidentSummaryCard({ data, incidents }: Props) {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(
    null,
  );
  const [page, setPage] = useState(1);

  const pagedIncidents = useMemo(() => {
    if (!incidents) return [];
    const start = (page - 1) * PAGE_SIZE;
    return incidents.slice(start, start + PAGE_SIZE);
  }, [incidents, page]);

  if (!data) return null;

  const totalSplit = data.internal + data.external || 1;
  const internalRatio = data.internal / totalSplit;
  const externalRatio = data.external / totalSplit;

  const totalPages = incidents
    ? Math.max(1, Math.ceil(incidents.length / PAGE_SIZE))
    : 1;

  const toggleDetail = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDetail(prev => !prev);
  };

  const openIncident = (item: IncidentItem) => setSelectedIncident(item);
  const closeIncident = () => setSelectedIncident(null);

  const goToPage = (p: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPage(p);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>Ringkasan Insiden</Text>
          <Text style={styles.subtitle}>Gambaran umum insiden BCM</Text>
        </View>
      </View>

      <View style={styles.heroBlock}>
        <Text style={styles.heroValue}>{data.total}</Text>
        <Text style={styles.heroLabel}>Total insiden tercatat</Text>

        <View style={styles.segmentTrack}>
          <View
            style={[
              styles.segmentFill,
              { flex: internalRatio || 0.0001, backgroundColor: EMERALD },
            ]}
          />
          <View
            style={[
              styles.segmentFill,
              { flex: externalRatio || 0.0001, backgroundColor: AMBER },
            ]}
          />
        </View>

        <View style={styles.segmentLegendRow}>
          <View style={styles.segmentLegendItem}>
            <View
              style={[styles.legendDotSmall, { backgroundColor: EMERALD }]}
            />
            <Text style={styles.segmentLegendText}>
              Internal · {data.internal}
            </Text>
          </View>
          <View style={styles.segmentLegendItem}>
            <View style={[styles.legendDotSmall, { backgroundColor: AMBER }]} />
            <Text style={styles.segmentLegendText}>
              Eksternal · {data.external}
            </Text>
          </View>
        </View>
      </View>

      {incidents && incidents.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={toggleDetail}
            activeOpacity={0.7}
          >
            <Text style={styles.detailButtonText}>
              {showDetail
                ? 'Sembunyikan Detail Insiden'
                : 'Lihat Detail Insiden'}
            </Text>
          </TouchableOpacity>

          {showDetail && (
            <View style={styles.listBlock}>
              {pagedIncidents.map((item, idx) => {
                const allImpactTags = (item.iid_impact ?? '')
                  .split(',')
                  .map(t => t.trim())
                  .filter(Boolean);

                const MAX_TAGS = 3;
                const impactTags = allImpactTags.slice(0, MAX_TAGS);
                const remainingCount = allImpactTags.length - MAX_TAGS;
                const isExternal = item.iid_eksternal === 1;

                return (
                  <TouchableOpacity
                    key={item.iid_id ?? idx}
                    style={[
                      styles.incidentRow,
                      idx !== pagedIncidents.length - 1 &&
                        styles.incidentRowDivider,
                    ]}
                    onPress={() => openIncident(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.incidentRowHeader}>
                      <Text style={styles.incidentName} numberOfLines={1}>
                        {item.iid_insiden}
                      </Text>
                      <View
                        style={[
                          styles.typeBadge,
                          {
                            backgroundColor: isExternal ? '#FEF3C7' : '#E6F7F6',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeBadgeText,
                            { color: isExternal ? AMBER : EMERALD },
                          ]}
                        >
                          {isExternal ? 'Eksternal' : 'Internal'}
                        </Text>
                      </View>
                    </View>

                    {!!item.iid_tgl_mulai_kejadian && (
                      <Text style={styles.incidentDate}>
                        {formatTanggal(item.iid_tgl_mulai_kejadian)}
                      </Text>
                    )}

                    {impactTags.length > 0 && (
                      <View style={styles.impactTagRow}>
                        {impactTags.map((tag, tagIdx) => (
                          <View key={tagIdx} style={styles.impactTag}>
                            <Text style={styles.impactTagText}>{tag}</Text>
                          </View>
                        ))}
                        {remainingCount > 0 && (
                          <View
                            style={[styles.impactTag, styles.impactTagMore]}
                          >
                            <Text
                              style={[
                                styles.impactTagText,
                                styles.impactTagMoreText,
                              ]}
                            >
                              +{remainingCount}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              {totalPages > 1 && (
                <View style={styles.pagination}>
                  <TouchableOpacity
                    disabled={page === 1}
                    onPress={() => goToPage(page - 1)}
                    style={[
                      styles.pageArrow,
                      page === 1 && styles.pageArrowDisabled,
                    ]}
                  >
                    <Text style={styles.pageArrowText}>‹</Text>
                  </TouchableOpacity>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    p => (
                      <TouchableOpacity
                        key={p}
                        onPress={() => goToPage(p)}
                        style={[
                          styles.pageNumber,
                          p === page && styles.pageNumberActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.pageNumberText,
                            p === page && styles.pageNumberTextActive,
                          ]}
                        >
                          {p}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}

                  <TouchableOpacity
                    disabled={page === totalPages}
                    onPress={() => goToPage(page + 1)}
                    style={[
                      styles.pageArrow,
                      page === totalPages && styles.pageArrowDisabled,
                    ]}
                  >
                    <Text style={styles.pageArrowText}>›</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </>
      )}

      {/* ===== Modal Full-Screen Detail Insiden ===== */}
      <Modal
        visible={!!selectedIncident}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeIncident}
      >
        {selectedIncident && (
          <View style={styles.fullScreenContainer}>
            {/* Header */}
            <View style={styles.fullHeaderRow}>
              <View style={{ flex: 1 }}>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      alignSelf: 'flex-start',
                      backgroundColor:
                        selectedIncident.iid_eksternal === 1
                          ? '#FEF3C7'
                          : '#E6F7F6',
                      marginBottom: 8,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBadgeText,
                      {
                        color:
                          selectedIncident.iid_eksternal === 1
                            ? AMBER
                            : EMERALD,
                      },
                    ]}
                  >
                    {selectedIncident.iid_eksternal === 1
                      ? 'Eksternal'
                      : 'Internal'}
                  </Text>
                </View>
                <Text style={styles.fullTitle}>
                  {selectedIncident.iid_insiden}
                </Text>
              </View>
              <TouchableOpacity
                onPress={closeIncident}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.fullContent}
              showsVerticalScrollIndicator={true}
            >
              {/* Info Grid: Waktu & Kategori berdampingan */}
              <View style={styles.infoGrid}>
                {!!selectedIncident.iid_tgl_mulai_kejadian && (
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardLabel}>Waktu Kejadian</Text>
                    <Text style={styles.infoCardValue}>
                      {formatTanggal(selectedIncident.iid_tgl_mulai_kejadian)}
                    </Text>
                    {(!!selectedIncident.iid_jam_mulai ||
                      !!selectedIncident.iid_jam_selesai) && (
                      <Text style={styles.infoCardSub}>
                        {selectedIncident.iid_jam_mulai ?? '-'}
                        {' — '}
                        {selectedIncident.iid_tgl_selesai_kejadian &&
                        selectedIncident.iid_tgl_selesai_kejadian !==
                          selectedIncident.iid_tgl_mulai_kejadian
                          ? `${formatTanggal(
                              selectedIncident.iid_tgl_selesai_kejadian,
                            )} `
                          : ''}
                        {selectedIncident.iid_jam_selesai ?? '-'}
                      </Text>
                    )}
                  </View>
                )}

                {!!selectedIncident.dbmak_nama && (
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardLabel}>Kategori Aplikasi</Text>
                    <Text style={styles.infoCardValue}>
                      {selectedIncident.dbmak_nama}
                    </Text>
                  </View>
                )}
              </View>

              {!!selectedIncident.iid_impact && (
                <View style={styles.section}>
                  <Text style={styles.modalLabel}>Impact</Text>
                  <View style={styles.impactTagRow}>
                    {selectedIncident.iid_impact
                      .split(',')
                      .map(t => t.trim())
                      .filter(Boolean)
                      .map((tag, i) => (
                        <View key={i} style={styles.impactTag}>
                          <Text style={styles.impactTagText}>{tag}</Text>
                        </View>
                      ))}
                  </View>
                </View>
              )}

              {!!selectedIncident.iid_kronologi && (
                <View style={styles.section}>
                  <Text style={styles.modalLabel}>Kronologi</Text>
                  <View style={styles.contentBox}>
                    <Text style={styles.modalText}>
                      {decodeHtmlText(selectedIncident.iid_kronologi)}
                    </Text>
                  </View>
                </View>
              )}

              {!!selectedIncident.iid_rca && (
                <View style={styles.section}>
                  <Text style={styles.modalLabel}>RCA</Text>
                  <View style={styles.contentBox}>
                    <Text style={styles.modalText}>
                      {decodeHtmlText(selectedIncident.iid_rca)}
                    </Text>
                  </View>
                </View>
              )}

              {!!selectedIncident.iid_keterangan_temporary && (
                <View style={styles.section}>
                  <Text style={styles.modalLabel}>Solusi Sementara</Text>
                  <View style={[styles.contentBox, styles.contentBoxAmber]}>
                    <Text style={styles.modalText}>
                      {decodeHtmlText(
                        selectedIncident.iid_keterangan_temporary,
                      )}
                    </Text>
                  </View>
                </View>
              )}

              {!!selectedIncident.iid_keterangan_permanent_solution && (
                <View style={styles.section}>
                  <Text style={styles.modalLabel}>Solusi Permanen</Text>
                  <View style={[styles.contentBox, styles.contentBoxEmerald]}>
                    <Text style={styles.modalText}>
                      {decodeHtmlText(
                        selectedIncident.iid_keterangan_permanent_solution,
                      )}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E7EAF0',
    padding: 18,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    marginBottom: 24,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 17, fontWeight: '700', color: NAVY },
  subtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  heroBlock: { backgroundColor: '#F8FAFC', borderRadius: 18, padding: 18 },
  heroValue: {
    fontSize: 34,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: -0.5,
  },
  heroLabel: { fontSize: 12, color: '#94A3B8', marginTop: 2, marginBottom: 14 },
  segmentTrack: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  segmentFill: { height: '100%' },
  segmentLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  segmentLegendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDotSmall: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  segmentLegendText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  detailButton: {
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  detailButtonText: { fontSize: 13, fontWeight: '700', color: EMERALD },
  listBlock: { marginTop: 14 },
  incidentRow: { paddingVertical: 10 },
  incidentRowDivider: { borderBottomWidth: 1, borderBottomColor: '#EEF1F5' },
  incidentRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  incidentName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
    marginRight: 8,
  },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  impactTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },
  impactTag: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  impactTagText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  pageArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  pageArrowDisabled: { opacity: 0.4 },
  pageArrowText: { fontSize: 16, color: NAVY, fontWeight: '700' },
  pageNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumberActive: { backgroundColor: EMERALD },
  pageNumberText: { fontSize: 13, color: '#64748B', fontWeight: '700' },
  pageNumberTextActive: { color: '#FFFFFF' },
  impactTagMore: { backgroundColor: '#E6F7F6' },
  impactTagMoreText: { color: EMERALD },
  incidentDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 5,
    marginBottom: 5,
  },

  // ===== Full-screen modal =====
  fullScreenContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  fullHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F5',
  },
  fullTitle: { fontSize: 19, fontWeight: '800', color: NAVY, lineHeight: 25 },
  fullContent: { padding: 20, paddingBottom: 40 },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginTop: 4,
  },
  modalCloseText: { fontSize: 14, color: NAVY, fontWeight: '700' },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
  },
  infoCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  infoCardValue: { fontSize: 13, fontWeight: '700', color: NAVY },
  infoCardSub: { fontSize: 11, color: '#64748B', marginTop: 2 },

  section: { marginBottom: 20 },
  modalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  modalText: { fontSize: 13, color: NAVY, lineHeight: 20 },
  contentBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
  },
  contentBoxAmber: { backgroundColor: '#FFFBEB' },
  contentBoxEmerald: { backgroundColor: '#F0FDFA' },
});
