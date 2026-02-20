import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /* =====================
     WRAPPER
  ===================== */
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

  headerRow: {
    width: '93%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  backButtonWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,

    backgroundColor: '#2CCABC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* =====================
     PILL BASE
  ===================== */
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginLeft: 4,
    height: 50,
    backgroundColor: '#ffffffcb',
    borderRadius: 999,
  },

  /* === VARIANTS === */
  pillBack: {
    width: 50,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pillSearch: {
    width: 219,
  },

  pillNormal: {
    width: '60%',
  },

  /* =====================
     LEFT CONTENT
  ===================== */
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

  pillHidden: {
    width: 0,
    padding: 0,
  },

  /* =====================
     RIGHT ACTIONS
  ===================== */
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: 130,
    justifyContent: 'flex-end',
  },

  searchBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#ffffffcb',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  bellWrapper: {
    borderRadius: 20,
    width: 35,
    height: 35,
    backgroundColor: '#ffffffcb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },

  notifBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },

  iconBtn: {
    marginRight: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* =====================
     AVATAR
  ===================== */
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 24,
  },

  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitial: {
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 12,
    fontWeight: '900',
    color: '#F8AD3CFF',
    backgroundColor: 'rgba(248,173,60,0.15)',
  },

  /* =====================
     SEARCH
  ===================== */
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

  /* =====================
     SEARCH RESULT
  ===================== */
  searchResultWrapper: {
    position: 'absolute',
    top: 95,
    left: 16,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 14,
    elevation: 6,
    zIndex: 999,
    paddingVertical: 6,
  },

  searchItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  searchText: {
    fontSize: 16,
    color: '#111827',
  },

  noResult: {
    padding: 16,
    textAlign: 'center',
    color: '#9CA3AF',
  },
});
