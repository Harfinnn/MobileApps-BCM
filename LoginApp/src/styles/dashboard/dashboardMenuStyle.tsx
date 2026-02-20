import { StyleSheet } from 'react-native';

const DashboardMenuStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 99,
  },

  sheet: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  item: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 16,
  },

  itemPressed: {
    backgroundColor: '#F9FAFB',
  },

  iconImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },

  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
});

export default DashboardMenuStyles;
