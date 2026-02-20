import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, paddingBottom: 70},
  headerContainer: { paddingHorizontal: 20, paddingTop: 90 },

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
    textTransform: 'uppercase',
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
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  analyticsTitle: { fontWeight: '700', color: '#1e293b' },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  dividerV: {
    width: 1,
    height: 30,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 15,
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

  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  liveText: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },

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
});
