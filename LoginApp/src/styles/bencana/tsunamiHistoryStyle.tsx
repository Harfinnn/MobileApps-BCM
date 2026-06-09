import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Ultra-clean premium light gray
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 75,
    paddingBottom: 20,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },

  /* Card Component Wrapper & Press Action Effect */
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 20,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  premiumCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },

  /* Card Header Row Styling */
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeLatest: {
    backgroundColor: '#0F172A', // Deep strong black accent for latest badge
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeLatestText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* Dashboard Stats Grid Inside Card */
  mainInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statElement: {
    flex: 1,
  },
  statLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 2,
  },
  magnitudeNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 28,
  },
  depthValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  depthValueText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
  },
  innerVerticalDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },

  /* Core Contextual Text Fields */
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  locationIcon: {
    marginTop: 3,
    marginRight: 8,
  },
  areaText: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
    fontWeight: '700',
  },
  potentialContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  potentialText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  headlineText: {
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 14,
    fontSize: 13,
    fontWeight: '400',
    paddingHorizontal: 2,
  },

  /* Card Border Footer Divider */
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    paddingHorizontal: 2,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
});

export default styles;
