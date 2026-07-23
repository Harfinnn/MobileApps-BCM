import { StyleSheet } from 'react-native';

// Design tokens — biar konsisten dan gampang diubah di satu tempat
const COLORS = {
  primary: '#00A39D', // Emerald Green
  primaryDark: '#007A77', // Teal gelap
  navy: '#0F172A', // Dark Navy
  slate: '#334155',
  muted: '#64748B',
  border: '#E2E8F0',
  bgLight: '#F8FAFC', // Light Gray
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  header: {
    paddingTop: 90,
    paddingBottom: 44,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },

  avatarWrapper: {
    alignItems: 'center',
  },

  avatarGlow: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    marginBottom: 16,
  },

  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  roleBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },

  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  scrollContent: {
    padding: 16,
    paddingTop: 22,
    paddingBottom: 40,
    backgroundColor: COLORS.bgLight,
    flexGrow: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  sectionLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.muted,
    marginBottom: 12,
    marginTop: 14,
    letterSpacing: 1.4,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIconBg: {
    width: 42,
    height: 42,
    backgroundColor: '#EBFBFA',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  menuLabel: {
    fontSize: 15.5,
    fontWeight: '600',
    color: COLORS.slate,
  },

  logoutBtn: {
    marginTop: 22,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: '#FCE4E4',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  logoutText: {
    marginLeft: 10,
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: 15.5,
  },

  // Verify Password Modal
  verifyOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.55)',
    justifyContent: 'center',
    padding: 24,
  },

  verifyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  verifyTitle: {
    fontWeight: '700',
    marginBottom: 14,
    fontSize: 16,
    color: COLORS.navy,
  },

  verifyInput: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 15,
    color: COLORS.navy,
  },

  verifySubmitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },

  verifySubmitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  verifyCancelBtn: {
    marginTop: 12,
    paddingVertical: 6,
  },

  verifyCancelText: {
    textAlign: 'center',
    color: COLORS.muted,
    fontWeight: '500',
  },
});
