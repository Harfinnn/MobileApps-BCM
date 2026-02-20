import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerInfo: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 24,
  },
  badge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginTop: 12,
  },
  imageWrapper: {
    paddingHorizontal: 20, 
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 20, 
    backgroundColor: '#EEE',
  },
  body: {
    paddingHorizontal: 20,
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    lineHeight: 28, 
    marginBottom: 20,
  },
  leadParagraph: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    lineHeight: 30,
    borderLeftWidth: 3, 
    borderLeftColor: '#000',
    paddingLeft: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});