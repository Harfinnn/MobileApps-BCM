import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContainer: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
  },
  upperTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A0AEC0',
    letterSpacing: 1.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A202C',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    marginLeft: 10,
    marginTop: 8,
  },
  heroCard: {
    backgroundColor: '#1A202C',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#1A202C',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  heroLabel: {
    color: '#A0AEC0',
    fontSize: 14,
    fontWeight: '600',
  },
  heroValue: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    marginTop: 4,
  },
  percentageBadge: {
    backgroundColor: '#2D3748',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  percentageText: {
    color: '#68D391',
    fontWeight: '800',
    fontSize: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  barGroup: {
    alignItems: 'center',
  },
  barBack: {
    width: 6,
    height: 80,
    backgroundColor: '#2D3748',
    borderRadius: 3,
    justifyContent: 'flex-end',
  },
  barFront: {
    width: 6,
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  barLabel: {
    color: '#718096',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    width: (width - 64) / 2,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  statNum: {
    fontSize: 24,
    fontWeight: '900',
    color: '#6366F1',
  },
  statDesc: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A202C',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  itemMain: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
  },
  itemSub: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '600',
    marginTop: 4,
  },
  scoreContainer: {
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreText: {
    fontWeight: '900',
    fontSize: 14,
  }
});

export default styles;