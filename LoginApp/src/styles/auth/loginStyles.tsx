import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F0FDFA',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  /* ================= HEADER ================= */

  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logoImage: {
    width: width * 0.6,
    height: 120,
  },

  /* ================= CARD ================= */

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    shadowColor: '#00A39D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },

  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#00A39D',
    marginBottom: 24,
    textAlign: 'left',
  },

  /* ================= INPUT ================= */

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },

  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    color: '#0F172A',
    fontSize: 15,
  },

  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    color: '#0F172A',
    fontSize: 15,
  },

  eyeButton: {
    paddingLeft: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  showText: {
    color: '#00A39D',
    fontWeight: '700',
    fontSize: 12,
  },

  /* ================= LUPA PASSWORD ================= */

  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
    marginTop: -4,
  },

  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0EA5E9',
  },

  /* ================= ERROR ================= */

  errorBox: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },

  errorText: {
    color: '#DC2626',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },

  /* ================= ACTION ================= */

  loader: {
    marginTop: 16,
  },

  loginButton: {
    backgroundColor: '#00A39D',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#00A39D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  /* ================= FOOTER ================= */

  footerVersion: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 30,
    fontWeight: '500',
  },
});
