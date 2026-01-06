  import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    alignItems: 'center',
    zIndex: 10,
  },

  pill: {
    width: '93%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(18, 203, 236, 1)',
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
    marginLeft: 12,
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
    paddingRight: 12,
    paddingVertical: 8,
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
    width: 28,
    height: 28,
    borderRadius: 14,
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
});
