import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#E6FFFA', // soft green BSI
    padding: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 14,
    elevation: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#00A39D', // primary BSI
  },

  input: {
    borderWidth: 1,
    borderColor: '#99DAD6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#0F172A',
  },

  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#99DAD6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#0F172A',
  },

  toggle: {
    color: '#00A39D',
    fontWeight: '600',
  },

  error: {
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#00A39D', // BSI primary
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    elevation: 3,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
