import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#F4F7F9',
  },
  /* HEADER */
  header: {
    backgroundColor: '#C62828',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#FFCDD2',
    marginTop: 4,
  },
  /* CONTENT */
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  /* ALERT CARD */
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timeText: {
    color: '#888',
    fontSize: 12,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  magContainer: {
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    width: 60,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  magValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#B91C1C',
  },
  magUnit: {
    fontSize: 10,
    color: '#7F1D1D',
    marginTop: -2,
  },
  locationContainer: {
    flex: 1,
    marginLeft: 15,
  },
  alertLocation: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  coordinatesText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  /* LOKASI & IDENTITY GROUP */
  groupContainer: {
    marginBottom: 20,
  },
  locationCard: {
    backgroundColor: '#E0F2F1',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 30,
    borderColor: '#B2DFDB',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00695C',
  },
  locationContent: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 10,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#004D40',
    fontWeight: '600',
  },
  miniIdentityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginTop: -12,
    marginHorizontal: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  miniInfoItem: {
    flex: 1,
  },
  miniLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  miniValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  /* FORM SECTION */
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  lineDecoration: {
    height: 3,
    width: 30,
    backgroundColor: '#C62828',
    borderRadius: 2,
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    fontWeight: '500',
    lineHeight: 20,
  },
  formRow: {
    marginVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 15,
  },
  /* PHOTO */
  photoButton: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  /* ACTION */
  footerAction: {
    marginTop: 10,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#C62828',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#FCA5A5',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
});
