import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 4 - 10;

export const styles = StyleSheet.create({

  menuGrid: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },

  menuItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginBottom: 18,
  },

  menuText: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    color: '#111827',
    fontWeight: '600',
  },

  menuTextImage: {
    fontWeight: '600',
  },

  menuTextSheet: {
    fontSize: 11,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#ECFEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconWrapper: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },

  iconFrame: {
    width: 50,
    height: 50,
    borderRadius: 14,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: '#E9EBF7',

    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.05)',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  frameHighlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: '22%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    zIndex: 2,
  },

  iconShadowBase: {
    position: 'absolute',
    bottom: -6,
    width: 36,
    height: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.12)',
    zIndex: 0,
  },

  floatingIcon: {
    position: 'absolute',
    zIndex: 3,
    backgroundColor: 'transparent',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 7,
  },

  sheetHeader: {
    paddingHorizontal: 18,
    paddingBottom: 30,
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
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginBottom: 20,
  },

  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
});
