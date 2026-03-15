import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00A39D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
    zIndex: 10,
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
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.5,
  },

  footerText: {
    position: 'absolute',
    bottom: 50,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* Decorative background shapes */

  circleTop: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  circleBottom: {
    position: 'absolute',
    bottom: -height * 0.15,
    left: -width * 0.2,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
});
