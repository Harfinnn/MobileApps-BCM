import { StyleSheet } from 'react-native';

const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  section: {
    marginTop: 40,
  },

  whiteContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
  },

  /* =========================
     FLOATING DISASTER CTA
  ========================= */
  disasterCTA: {
    position: 'absolute',
    top: 235, // sesuaikan dengan tinggi header
    left: 35,
    right: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgb(220, 38, 38)',
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 8, // Android shadow
    zIndex: 999,
  },

  disasterText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default HomeScreenStyles;
