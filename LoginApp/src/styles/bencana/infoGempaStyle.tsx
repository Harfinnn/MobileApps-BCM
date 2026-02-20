import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingTop: 85,
    paddingHorizontal: 20,
    paddingBottom: 40,
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

  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },

  magnitudeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  magCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EE4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  magValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
  },
  magUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    marginTop: -4,
  },

  statusBadge: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    textAlign: 'center',
  },

  infoGrid: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
    paddingBottom: 16,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },

  locationContainer: {
    marginBottom: 20,
  },
  locLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  locValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 24,
  },

  mapButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  mapButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
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
});
