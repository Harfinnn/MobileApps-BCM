import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 30,
  },

  menuItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 18,
  },

  menuText: {
    fontSize: 16,
    marginTop: 6,
    textAlign: 'center',
    color: '#000',
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
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ECFEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
});
