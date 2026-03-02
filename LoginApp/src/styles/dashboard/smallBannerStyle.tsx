import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  more: {
    fontSize: 14,
    color: '#F8AD3C',
    fontWeight: '700',
  },

  /* HERO CARD */
  heroCard: {
    marginHorizontal: 20,
    backgroundColor: '#1F2937',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  heroLeft: {
    flex: 1.5,
  },

  heroTag: {
    color: '#F8AD3C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },

  heroBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  heroBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  heroRight: {
    flex: 1,
    alignItems: 'center',
  },

  heroIcon: {
    width: 85,
    height: 85,
  },

  /* QUICK ACTIONS */
  scroll: {
    marginTop: 20,
    paddingLeft: 20,
  },

  actionCard: {
    width: 90,
    marginRight: 16,
    alignItems: 'center',
  },

  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  miniIcon: {
    width: 35,
    height: 35,
  },

  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
});

export default styles;