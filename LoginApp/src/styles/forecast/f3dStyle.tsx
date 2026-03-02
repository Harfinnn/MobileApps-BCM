import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, paddingBottom: 70 },
  headerContainer: { paddingHorizontal: 20, paddingTop: 20 },

  headerTop: { marginBottom: 20 },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  headerDate: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 1.5,
  },

  tempBig: {
    fontSize: 84,
    fontWeight: '400',
    color: '#1E293B',
    letterSpacing: -2,
  },

  headerLocation: {
    fontSize: 12,
    color: '#4a5667',
    marginTop: 10,
    marginLeft: 10,
  },

  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 160,
    marginBottom: 20,
  },
  heroTextContent: { flex: 1 },
  heroCondition: {
    fontSize: 24,
    color: '#64748b',
    fontWeight: '500',
    marginTop: -5,
  },
  animationContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieHero: { width: 180, height: 180 },

  alertBanner: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  safeBanner: { backgroundColor: '#f0fdf4', borderColor: '#dcfce7' },
  dangerBanner: { backgroundColor: '#fef2f2', borderColor: '#fee2e2' },
  alertTextWrapper: { marginLeft: 12, flex: 1 },
  safeTitle: { color: '#166534', fontWeight: '700', fontSize: 14 },
  alertTitle: { color: '#991b1b', fontWeight: '700', fontSize: 14 },

  analyticsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  analyticsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    // Efek glassmorphism tipis pada ikon
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 2,
  },

  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },

  // Forecast List
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 15,
  },
  forecastCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  forecastCardActive: { borderColor: '#0ea5e9', backgroundColor: '#f8fafc' },
  forecastSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  forecastIconBg: {
    width: 45,
    height: 45,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecastDay: { fontWeight: '700', color: '#1e293b', fontSize: 15 },
  forecastConditionText: { fontSize: 12, color: '#64748b' },
  forecastTempText: { fontSize: 18, fontWeight: '800', color: '#1e293b' },

  // Hourly (Expanded)
  hourlyList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  hourlyItem: { alignItems: 'center', gap: 5 },
  hourlyTimeText: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  hourlyTempText: { fontSize: 13, fontWeight: '700', color: '#1e293b' },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  safeDesc: {
    color: '#15803d',
    fontSize: 12,
    marginTop: 2,
  },
  alertDesc: {
    color: '#b91c1c',
    fontSize: 12,
    marginTop: 2,
  },

  unitText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '400',
  },

  tempWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  minMaxRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },

  minTempText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b82f6',
  },

  maxTempText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ef4444',
    marginTop: 2,
  },

  detailDropdown: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 10,
  },

  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  insightIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    // Soft shadow untuk icon kecil
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },

  insightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    paddingRight: 14,
    paddingLeft: 0,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },

  statusIndicator: {
    width: 5,
    height: '100%',
    marginRight: 15,
  },

  insightContent: {
    flex: 1,
    justifyContent: 'center',
  },

  detailLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  detailText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 18,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  humidityCircle: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },

  humidityBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },

  humidityBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },

  windCircle: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },

  windBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
});
