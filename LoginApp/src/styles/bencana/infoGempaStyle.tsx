import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  updateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  mapSection: {
    width: '100%',
    height: 250,
    marginTop: 0,
    marginBottom: 16,
  },
  mapLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 12,
  },
  shadowWrapper: {
    marginBottom: 30,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  premiumCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroMap: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayTop: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  overlayBadge: {
    flexDirection: 'row', // Ditambahkan agar icon dan text sejajar
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  overlayBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },

  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24, // Sedikit dilonggarkan
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12, // Bentuk squircle modern untuk background ikon
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  statValueSmall: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },

  potensiWrapper: {
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 16,
  },
  potensiPill: {
    flexDirection: 'row', // Agar ikon dan teks sejajar
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  potensiText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
  },

  detailsContainer: {
    padding: 20,
  },
  detailListRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailListLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  detailListValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
  },
  mapWrapper: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  shareButtonWrapper: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },

  shareButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.95)',

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,

    elevation: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
  },

  listItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  listMag: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgWarning: {
    backgroundColor: '#FEF3C7',
  },
  bgInfo: {
    backgroundColor: '#E0F2FE',
  },
  listMagText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },

  listContent: {
    flex: 1,
    marginLeft: 16,
  },
  listLoc: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  listTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  listScale: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 4,
    fontWeight: '500',
  },

  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  expandButton: {
    width: 44,
    height: 44,
    borderRadius: 22, // Ubah jadi bulat penuh agar terlihat lebih rapi dengan Chevron
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterWrapper: { marginBottom: 16 },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: 'row', // Penting untuk ikon Check/Hourglass di dalam chip
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  filterChipText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  filterChipTextActive: { color: '#FFFFFF' },
  emptyStateTextMsg: {
    textAlign: 'center',
    color: '#64748B',
    marginVertical: 20,
  },
  /* ------------------------------- */

  unitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  unitInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  unitName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  distanceBadge: {
    backgroundColor: '#cbcbcb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  distanceText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  priorityBadge: {
    backgroundColor: '#0c0c0c',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E11D48',
  },
  distanceTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  distanceFill: {
    height: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 3,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  emptyStateText: {
    color: '#94A3B8',
    fontSize: 14,
  },
});
