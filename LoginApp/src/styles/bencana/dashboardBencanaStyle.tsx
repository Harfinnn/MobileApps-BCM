import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  listContent: { paddingBottom: 24 },
  headerContainer: { paddingBottom: 8, paddingTop: 60 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    marginLeft: 20,
    marginTop: 24,
    marginBottom: 12,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },

  sectionLabelInline: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.2,
  },

  activeFilterText: {
    fontWeight: '600',
    color: '#3B82F6',
    textTransform: 'capitalize',
  },

  // Menyederhanakan area sentuh untuk ikon
  iconButton: {
    padding: 6, // Memberi ruang agar mudah diklik oleh jari
    justifyContent: 'center',
    alignItems: 'center',
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
  map: { flex: 1 },
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
  emptyText: { fontSize: 13, color: '#9CA3AF' },

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
  zoomText: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  zoomResetText: { fontSize: 18, fontWeight: '800', color: '#2563EB' },

  /* ================= FILTER CHIPS ================= */
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#1A73E8',
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
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
