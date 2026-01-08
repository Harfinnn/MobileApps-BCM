import { StyleSheet } from 'react-native';

const HomeScreenStyles = StyleSheet.create({
  greetingCard: {
    marginTop: 16,
    marginHorizontal: 18,
    padding: 5,
    borderRadius: 14,
    borderColor: '#2CCABC',
    borderWidth: 2,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  greetingSmall: {
    fontSize: 13,
    color: '#F8AD3CFF',
    left: 10,
  },

  greetingName: {
    fontSize: 18,
    left: 10,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  weatherAnim: {
    width: 60,
    height: 60,
  },

  section: {
    marginTop: 20,
  },

  whiteContainer: {
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  marginTop: -25,
},
});

export default HomeScreenStyles;
