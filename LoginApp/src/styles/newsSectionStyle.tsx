import { StyleSheet } from 'react-native';

const NewsSectionStyles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  more: {
    fontSize: 13,
    color: '#F8AD3C',
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    elevation: 1,
  },

  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 8,
    resizeMode: 'cover',
    marginRight: 12,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },

  summary: {
    fontSize: 12,
    color: '#4B5563',
  },

  date: {
    fontSize: 11,
    color: '#F8AD3C',
    marginTop: 6,
  },
});

export default NewsSectionStyles;
