import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  container: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },

  /* ================= LOGO ================= */

  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },

  logoText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
  },

  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },

  versionBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },

  /* ================= CARD ================= */

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },

  description: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },

  /* ================= FEATURES ================= */

  section: {
    width: '100%',
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    paddingLeft: 4,
  },

  featureGrid: {
    backgroundColor: '#FFF',
    borderRadius: 20,
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
    backgroundColor: '#1A73E8',
    marginRight: 12,
  },

  featureText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  /* ================= INFO ================= */

  infoList: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  /* ================= FOOTER ================= */

  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  footer: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  footerSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
