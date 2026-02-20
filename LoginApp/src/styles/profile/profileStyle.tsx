import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009B97',
  },

  header: {
    paddingTop: 90,
    paddingBottom: 40,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },

  avatarWrapper: {
    alignItems: 'center',
  },

  avatarGlow: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 60,
    marginBottom: 14,
  },

  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  roleBadge: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#009B97',
    textTransform: 'uppercase',
  },

  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 18,
    marginBottom: 24,
  },

  scrollContent: {
    padding: 10,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',

    flexGrow: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },

  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 12,
    marginTop: 10,
    letterSpacing: 1.2,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // Android shadow
    elevation: 3,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIconBg: {
    width: 44,
    height: 44,
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },

  logoutBtn: {
    marginTop: 20,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  logoutText: {
    marginLeft: 10,
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 16,
  },
});
