import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 32,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    position: 'relative',
  },
  logoFrame: {
    width: 130,
    height: 130,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  editBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#1E293B',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadgeIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#00A39D',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  logoColumn: {
    flex: 1,
    alignItems: 'center',
  },

  logoLabel: {
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
    color: '#64748B',
  },
});
