import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },

  headerIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    textAlign: 'center',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 12,
  },

  faqAnswer: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    marginTop: 10,
  },
});
