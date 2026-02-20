import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarRing: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F8AD3C',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#009B97',
  },
  avatarLoadingOverlay: {
    position: 'absolute',
    inset: 5,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  btn: {
    backgroundColor: '#F8AD3C',
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F8AD3C',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  btnText: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 30,
  },

  headerCurve: {
    position: 'absolute',
    top: 0,
    height: 280,
    width: width,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },

  headerContent: {
    paddingTop: 80,
    paddingBottom: 30,
    alignItems: 'center',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
});
