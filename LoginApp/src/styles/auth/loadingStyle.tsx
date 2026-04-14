import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00A39D',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Mencegah background shapes keluar batas
  },

  content: {
    alignItems: 'center',
    zIndex: 10,
    // Tambahan shadow agar logo lebih 'pop-out' dari background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },

  logo: {
    width: width * 0.65,
    height: 140,
    marginBottom: 10,
  },

  /* Lottie Animation */
  lottie: {
    width: 120,
    height: 120,
    marginTop: 5,
  },

  loadingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 1,
  },

  footerText: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    zIndex: 10,
  },

  /* Decorative background shapes */
  circleTop: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width, // Diperbesar sedikit
    height: width,
    borderRadius: width / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  circleBottom: {
    position: 'absolute',
    bottom: -height * 0.15,
    left: -width * 0.3,
    width: width * 1.1, // Diperbesar sedikit
    height: width * 1.1,
    borderRadius: (width * 1.1) / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});
