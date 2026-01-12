import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'transparent',
    height: 70,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginLeft: 4,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#2CCABC',
    borderWidth: 2,
    borderRadius: 999,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000ff',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    marginRight: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  backBtn: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  greetingSmall: {
    fontSize: 12,
    color: '#F8AD3CFF',
  },

  greetingName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2CCABC',
  },

  avatarInitial: {
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 12,
    fontWeight: '700',
    color: '#F8AD3CFF',
    backgroundColor: 'rgba(248,173,60,0.15)',
  },

  headerRow: {
    width: '93%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 👈 PENTING
    marginTop: 10,
  },

  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: 130, // 👈 FIXED WIDTH
    justifyContent: 'flex-end',
  },

  bellWrapper: {
    borderRadius: 20,
    width: 35,
    height: 35,
    backgroundColor: 'rgba(251, 251, 251, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#2CCABC',
    borderWidth: 2,
  },

  searchBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#2CCABC',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 20,
    height: 40,
    width: 200,
    gap: 8,
    marginLeft: -12,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
    color: '#111827',
  },
});
