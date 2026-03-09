import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    // Spacing paddingTop disesuaikan agar tidak menempel ke atas
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 60,
    alignItems: 'center',
  },

  /* HERO SECTION */
  heroSection: {
    alignItems: 'center',
    marginBottom: 35,
  },
  mainLogoWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 35,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: { elevation: 8 },
    }),
  },
  mainLogo: {
    width: 120,
    height: 120,
    borderRadius: 35,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 35,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '900',
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 20,
    textAlign: 'center',
  },
  smallCompanyLogo: {
    width: 100,
    height: 100,
  },
  companyNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  versionBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10
  },
  versionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },

  /* CONTENT CARDS */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
    paddingLeft: 4,
  },
  featureGrid: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
  },
  infoList: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    marginBottom: 40,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* PARTNER SECTION */
  partnerSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  partnerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
  },

  /* FOOTER & SIGN */
  footerContainer: {
    marginTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    width: '100%',
  },

  footerCopyright: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },

  signSection: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },

  signCapsule: {
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  lineDivider: {
    width: 40,
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },

  signLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    letterSpacing: 2,
  },

  signName: {
    color: '#475569',
    fontWeight: '800',
  },

  footerRights: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  companySection: {
    width: '100%',
    alignItems: 'center',
  },

  companyTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  companyLogoLarge: {
    width: 140,
    height: 140,
  },

  companyLogoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo1: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo2: {
    width: 110,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10
  },

  logo3: {
    width: 100,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    right: 5
  },

  logoImage: {
    width: '100%',
    height: '100%',
  },
  companyNameLarge: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
  },
});
