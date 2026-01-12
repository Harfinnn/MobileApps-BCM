import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 90,
  },

  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  /* ===== AVATAR ===== */
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#2CCABC',
    marginBottom: 10,
  },

  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#ECFEFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2CCABC',
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2CCABC',
  },

  changePhoto: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#2563EB',
  },

  /* ===== FORM ===== */
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    fontSize: 15,
    color: '#111827',

    // shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },

    // elevation Android
    elevation: 2,
  },

  /* ===== BUTTON ===== */
  btn: {
    backgroundColor: '#F8AD3CFF',
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 16,

    shadowColor: '#F8AD3CFF',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },

    elevation: 4,
  },

  btnText: {
    textAlign: 'center',
    color: '#111827',
    fontWeight: '700',
    fontSize: 16,
  },
});
