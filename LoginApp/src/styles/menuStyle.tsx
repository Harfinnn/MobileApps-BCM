import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 18,
  },

  menuItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 18,
  },

  menuTextImage: {
    fontWeight: '600',
  },

  menuTextSheet: {
    fontSize: 11,
  },

  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },

  sheetHeader: {
    paddingHorizontal: 18,
    paddingBottom: 10,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  sheetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  sheetItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 20,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#ECFEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  moreImageIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  // styles/menuStyle.ts
  iconWrapper: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  iconFrame: {
    width: 50,
    height: 50,
    borderRadius: 14,
    position: 'absolute',
    top: 0,
    left: 0,
  },

  floatingIcon: {
    position: 'absolute',
    zIndex: 2,
  },

  menuText: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    color: '#111827',
    fontWeight: '600',
  },
});
