import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },

  pageContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },

  listContainer: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 24,
    marginTop: 70,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 10,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  thumbnail: {
    width: '100%',
    height: 180,
  },

  cardContent: {
    padding: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 22,
  },

  summary: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
    lineHeight: 18,
  },

  date: {
    fontSize: 11,
    color: '#999',
    marginTop: 10,
  },
});
