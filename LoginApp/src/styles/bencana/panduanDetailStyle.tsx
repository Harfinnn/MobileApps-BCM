import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  page: {
    backgroundColor: '#F1F5F9',
  },

  header: {
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  icon: {
    width: 44,
    height: 44,
    tintColor: '#FFFFFF',
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  sliderContainer: {
    marginTop: 16,
  },

  sliderContent: {
    paddingHorizontal: 24,
  },

  imageWrapper: {
    marginRight: 16,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  educationImage: {
    width: '100%',
    height: '100%',
  },

  counterText: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },

  contentCard: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0F172A',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  stepNumber: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  text: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 21,
  },
});
