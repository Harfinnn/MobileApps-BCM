import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerArea: {
    paddingHorizontal: 25,
    paddingTop: 80,
    marginBottom: 30,
  },
  overTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#F8AD3C',
    letterSpacing: 2,
    marginBottom: 8,
  },
  hugeTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 42,
    letterSpacing: -1.5,
  },
  divider: {
    width: 45,
    height: 5,
    backgroundColor: '#111827',
    marginTop: 20,
    borderRadius: 10,
  },

  /* CARD SYSTEM */
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardInner: {
    padding: 24,
    borderRadius: 32,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textInfo: {
    flex: 1.3,
    justifyContent: 'center',
  },
  stepCount: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 26,
    marginBottom: 18,
  },

  /* INTERACTIVE BUTTON */
  actionButton: {
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 10,
  },
  iconCircle: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: -2, // Penyesuaian visual posisi panah
  },

  /* IMAGE DECORATION */
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainIcon: {
    width: 90,
    height: 90,
    zIndex: 2,
  },
  blobShadow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.4,
    zIndex: 1,
    transform: [{ scale: 1.4 }],
  },
});
