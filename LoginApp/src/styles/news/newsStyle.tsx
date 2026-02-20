import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 80, 
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 220,
    backgroundColor: '#F9F9F9',
  },
  dateBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backdropFilter: 'blur(10px)',
  },
  dateText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A1A1A',
    textTransform: 'uppercase',
  },
  /* =====================
      CONTENT SECTION
  ===================== */
  cardContent: {
    padding: 22,
  },
  category: {
    fontSize: 11,
    fontWeight: '800',
    color: '#007AFF',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  summary: {
    fontSize: 14,
    color: '#666666',
    marginTop: 10,
    lineHeight: 22,
  },

  readMore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});