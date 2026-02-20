import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const NewsSectionStyles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  more: {
    fontSize: 14,
    color: '#F8AD3C',
    fontWeight: '600',
  },

  /* HERO CARD */
  heroCard: {
    marginHorizontal: 20,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    justifyContent: 'flex-end',
    // Gradasi manual menggunakan background semi-transparan
    backgroundColor: 'rgba(0,0,0,0.35)',
    height: '100%',
  },
  badge: {
    backgroundColor: '#F8AD3C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  heroDate: {
    color: '#E5E7EB',
    fontSize: 12,
    marginTop: 8,
  },

  /* HORIZONTAL SCROLL */
  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 10,
  },
  miniCard: {
    width: width * 0.6, // 60% dari lebar layar
    marginRight: 15,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 10,
  },
  miniThumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
  },
  miniContent: {
    paddingHorizontal: 2,
  },
  miniTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 18,
    height: 36, // Menjaga konsistensi tinggi untuk 2 baris
  },
  miniDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
  },

  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8AD3C',
  },
});

export default NewsSectionStyles;
