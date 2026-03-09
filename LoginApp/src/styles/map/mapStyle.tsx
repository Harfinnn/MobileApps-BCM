import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },

  /* MAP SECTION */
  mapContainer: {
    height: '55%',
    width: '100%',
    backgroundColor: '#F1F5F9',
  },

  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#0F172A',
    fontSize: 15,
  },

  floatingActions: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    zIndex: 10,
  },

  circleBtn: {
    width: 45,
    height: 45,
    borderRadius: 28,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  /* BOTTOM SHEET SECTION */
  bottomSheet: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    paddingHorizontal: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 15,
  },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },

  unitCount: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },

  scrollPadding: {
    paddingBottom: 120,
  },

  /* CARDS */
  unitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  selectedCard: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  selectedIconBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  infoBox: {
    flex: 1,
  },

  unitName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  unitDist: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  whiteText: {
    color: '#FFF',
  },

  lightText: {
    color: 'rgba(255,255,255,0.5)',
  },
});

export default styles;
