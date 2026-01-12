import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },

  image: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
  },

  contentCard: {
    backgroundColor: '#FFFFFF',
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    lineHeight: 28,
  },

  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    marginBottom: 16,
  },

  paragraph: {
    fontSize: 14,
    color: '#444',
    lineHeight: 24,
    marginBottom: 14,
  },

  leadParagraph: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
