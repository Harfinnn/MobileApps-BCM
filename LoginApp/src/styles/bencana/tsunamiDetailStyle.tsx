import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA', // App background ultra clean
  },
  container: {
    padding: 16,
    gap: 20, // Diperlebar agar memberikan kesan "breathing room" ala magazine
    paddingBottom: 40,
    paddingTop: 75,
  },

  /* Card Asli (Dipertahankan khusus untuk section PETA agar tidak berubah) */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  mapContainer: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  map: {
    flex: 1,
  },
  mapTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  mapTabActive: {
    backgroundColor: '#0F172A',
  },
  mapTabText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  mapTabTextActive: {
    color: '#FFFFFF',
  },
  bmkgImage: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },

  /* ---------------- BRAND NEW PREMIUM STYLES ---------------- */

  /* Premium Editorial Card (Borderless, Typography Focused) */
  editorialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeadingClean: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },

  /* Premium Banner (Headline style) */
  premiumBanner: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 30,
    gap: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  mainLocation: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 42,
    letterSpacing: -0.5,
  },

  /* Sleek Stats Panel Row */
  sleekStatsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  sleekStatBox: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0F172A',
  },
  inlineStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statValueSub: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* Clean Info Rows */
  infoRowClean: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabelClean: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  infoValueClean: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
  },

  /* Instruction Card Style */
  instructionCard: {
    backgroundColor: '#FFF7ED', // Soft orange tint box
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  bodyText: {
    fontSize: 15,
    color: '#7C2D12',
    lineHeight: 24,
    fontWeight: '500',
  },
  lightDivider: {
    height: 1,
    backgroundColor: '#FFEDD5',
    marginVertical: 16,
  },
  instructionLabelClean: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9A3412',
    letterSpacing: 1,
    marginBottom: 6,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#431407',
    lineHeight: 24,
  },
  secondaryText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 24,
  },

  /* Minimalist Area Row Tracker */
  minimalAreaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  areaRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  dotIndicatorWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  areaTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  districtText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  provinceText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  sleekStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  sleekStatusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default styles;
