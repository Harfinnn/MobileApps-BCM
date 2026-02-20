import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
  },

  card: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',

    // Android shadow
    elevation: 2,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  cardDanger: {
    backgroundColor: '#FEF2F2',
  },

  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  valueDanger: {
    color: '#DC2626',
  },

  label: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },

  labelDanger: {
    color: '#991B1B',
    fontWeight: '600',
  },
});
