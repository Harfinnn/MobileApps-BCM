import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 14,
    padding: 14,
    elevation: 2,
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
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Judul di kiri, Status di kanan
    alignItems: 'center',
    marginBottom: 4,
  },

  content: {
    flex: 1,
  },

  /* STYLE BADGE BARU */
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    flex: 1, // Agar teks judul tidak menabrak badge
    marginRight: 8,
  },

  sub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  meta: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
