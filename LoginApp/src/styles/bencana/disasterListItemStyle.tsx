import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 14,
    padding: 14,

    // Android shadow
    elevation: 2,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  pressed: {
    backgroundColor: '#F3F4F6',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  sub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  meta: {
    fontSize: 12,
    color: '#374151',
    marginTop: 6,
  },
});
