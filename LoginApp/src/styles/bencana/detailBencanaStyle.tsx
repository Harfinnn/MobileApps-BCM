import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6', 
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },

  /* --- MAP SECTION --- */
  mapWrapper: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  map: {
    flex: 1,
  },
  openMapBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)', // Slate 900 semi-transparent
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  openMapText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },

  /* --- INFO CARD MAIN --- */
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 30,
  },
  unitText: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },

  /* --- MODERN REPORT INFO CONTAINER --- */
  reportInfoContainer: {
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoRowDetailed: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoTextColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoMainText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '700',
    marginTop: 1,
  },
  phoneClickable: {
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },

  /* --- SECTION CONTENT --- */
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginTop: 4,
  },

  /* --- ACCORDION --- */
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  /* --- INFO GEMPA (COMPACT) --- */
  gempaInfoCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  gempaDataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  gempaDataItem: {
    alignItems: 'center',
    flex: 1,
  },
  gempaDataDivider: {
    width: 1,
    height: 25,
    backgroundColor: '#FDA4AF',
  },
  gempaDataLabel: {
    fontSize: 10,
    color: '#9F1239',
    marginBottom: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  gempaDataValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#881337',
  },
  gempaLocBox: {
    borderTopWidth: 1,
    borderTopColor: '#FECDD3',
    paddingTop: 10,
    alignItems: 'center',
  },
  gempaLocText: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 18,
  },

  /* --- KONDISI LAPANGAN GRID --- */
  conditionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  conditionTile: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  conditionEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  conditionLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  conditionStatus: {
    fontSize: 13,
    fontWeight: '900',
    marginTop: 1,
  },

  /* --- PHOTO --- */
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginTop: 12,
  },
  imageModal: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.98)', // Hampir hitam (Slate 900)
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: '80%',
  },
});
