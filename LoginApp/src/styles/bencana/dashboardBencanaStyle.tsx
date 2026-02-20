import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  listContent: {
    paddingBottom: 24,
  },

  headerContainer: {
    paddingBottom: 8,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    marginLeft: 20,
    marginTop: 24,
    marginBottom: 12,
  },

  /* ================= MAP ================= */

  mapCard: {
    height: 240,
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  map: {
    flex: 1,
  },

  mapBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },

  mapBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },

  mapPlaceholder: {
    height: 100,
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },

  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  zoomControls: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 6,
  },

  zoomBtn: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },

  zoomBtnReset: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  zoomText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },

  zoomResetText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },

  /* ================= FILTER WAKTU ================= */

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 5,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },

  filterChipActive: {
    backgroundColor: '#1A73E8',
  },

  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  /* ================= LIST ================= */

  itemWrapper: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
});
