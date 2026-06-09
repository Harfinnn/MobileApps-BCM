import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Palet Tema Light Industrial / Clean Room
const BG_COLOR = '#FFFFFF';
const SURFACE = '#F8FAFC'; 
const BORDER = '#E2E8F0'; 
const TEXT_DARK = '#0F172A'; 
const TEXT_MUTED = '#64748B';
const TEXT_BODY = '#475569';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  safeArea: {
    flex: 1,
  },

  /* EFEK GLOWING ORB DI BACKGROUND (LEBIH HALUS DI LIGHT MODE) */
  glowOrb: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.08, 
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
    elevation: 10,
  },

  container: {
    paddingHorizontal: 24,
  },

  /* HEADER ASIMETRIS */
  headerSection: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  systemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  statusText: {
    color: TEXT_DARK,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  hugeTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: TEXT_DARK,
    lineHeight: 50,
    letterSpacing: -2,
    fontFamily: 'sans-serif-black',
  },

  /* CLEAN CARD (PENGGANTI GLASSMORPHISM) */
  cleanCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  appProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  mainLogo: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
  },
  appMeta: {
    flex: 1,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_DARK,
    letterSpacing: -0.5,
  },
  versionText: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 1,
  },
  separator: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    color: TEXT_BODY,
    lineHeight: 24,
    fontWeight: '500',
  },

  /* LABEL BAGIAN BENTUK KODE */
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#94A3B8', 
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 16,
    fontFamily: 'monospace',
  },

  /* FITUR: FLOATING CHIPS */
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    color: TEXT_DARK,
    fontSize: 13,
    fontWeight: '700',
  },

  /* DATA SISTEM (BLUEPRINT TERMINAL STYLE) */
  terminalBox: {
    backgroundColor: SURFACE, 
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  terminalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  terminalKey: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '700',
  },
  terminalValue: {
    fontSize: 13,
    color: TEXT_DARK,
    fontWeight: '800',
    fontFamily: 'monospace',
  },

  /* INTEGRASI PARTNER */
  partnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
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
    opacity: 0.85,
  },

  /* FOOTER */
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  signText: {
    fontSize: 10,
    color: TEXT_MUTED,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
