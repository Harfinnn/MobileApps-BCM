import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topSection: { paddingHorizontal: 24, paddingTop: 80, paddingBottom: 10 },
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

  footer: { padding: 24 },
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
});
