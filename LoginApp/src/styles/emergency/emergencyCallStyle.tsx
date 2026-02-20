import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  headerSection: {
    marginTop: 80,
    marginBottom: 35,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  infoBadge: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 50,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 10,
    lineHeight: 22,
    fontWeight: '500',
  },
  list: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    padding: 16,
    borderWidth: 1.5,
    // Soft shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    // Inner shadow style
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  contentContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: -2,
  },
  callAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  warningBox: {
    marginTop: 40,
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  warningText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
});
