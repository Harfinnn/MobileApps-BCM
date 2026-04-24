import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    marginBottom: 10,
    left: 25,
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
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
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
    borderRadius: 12,
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
  verticalDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
  },
  potensiWrapper: {
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 16,
  },
  potensiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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

  shareButtonWrapper: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 10,
  },

  shareButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.9)',

    alignItems: 'center',
    justifyContent: 'center',

    // shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    // shadow Android
    elevation: 4,
  },

  shareIcon: {
    fontSize: 18,
  },

  topSection: {
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  magRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  magNumber: { fontSize: 80, fontWeight: '800', letterSpacing: -4 },
  srText: { fontSize: 18, fontWeight: '400', color: '#64748B', marginLeft: 12 },

  titleSection: { paddingHorizontal: 24, marginBottom: 30 },
  divider: {
    width: 40,
    height: 4,
    backgroundColor: '#0F172A',
    marginBottom: 20,
  },
  wilayahText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 36,
  },
  potensiBadge: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  potensiText: { fontSize: 12, fontWeight: '700', color: '#475569' },

  /* MAP TRIGGER BUTTON */
  mapTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapTriggerIcon: { fontSize: 24, marginRight: 15 },
  mapTriggerTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  mapTriggerSub: { fontSize: 12, color: '#64748B', marginTop: 2 },

  dataGrid: { paddingHorizontal: 24 },
  dataRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 20,
  },
  dataItem: { flex: 1 },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  value: { fontSize: 17, fontWeight: '600', color: '#1E293B' },
  fullDataItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  mmiValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 22,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'transparent', // penting
  },
  closeButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: { fontSize: 15, fontWeight: '700', color: '#FFF' },

  /* MODAL STYLES */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  modalHeader: { width: '100%', alignItems: 'flex-end', padding: 20 },
  modalCloseBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  modalCloseText: { color: '#FFF', fontWeight: '700' },
  modalScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  fullMapImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.7 },
  modalFooter: { padding: 30, alignItems: 'center' },
  zoomHint: { color: '#94A3B8', fontSize: 12, fontStyle: 'italic' },

  expandButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBar: {
    width: 14,
    height: 1.5,
    backgroundColor: '#0F172A',
    position: 'absolute',
    borderRadius: 1,
  },

  /* NEW RADIUS SECTION STYLES */
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* --- NEW FILTER CHIPS STYLES --- */
  filterWrapper: { marginBottom: 16 },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
  // --- STYLE PETA ---
  mapSection: {
    width: '100%',
    height: 250,
    marginTop: 20,
    marginBottom: 20,
  },
  mapWrapper: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  mapPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayTop: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
  },
  overlayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    fontWeight: '700',
    color: '#0F172A',
  },
});
