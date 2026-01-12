import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  menuCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 16,
    marginTop: 12,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    elevation: 6,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 80,
  },

  /* ===== AVATAR ===== */
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 28,
  },

  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    marginBottom: 12,
  },

  avatarPlaceholder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#ECFEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#2CCABC',
  },

  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2CCABC',
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },

  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },

  /* ===== MENU ===== */
  menu: {
    marginTop: 16,
  },

  menuItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 14,

    // shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    // elevation Android
    elevation: 3,
  },

  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
});
