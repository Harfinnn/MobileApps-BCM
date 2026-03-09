import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },

  /* --- STYLES UNTUK FLOATING BANNER --- */
  floatingBanner: {
    borderWidth: 1,
    borderColor: '#E2F4F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    shadowColor: '#00A39D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 10,
    marginTop: 20,
  },
  bannerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2A38',
  },
  limitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 4,
  },

  limitDanger: {
    color: '#EF4444',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  clearBtnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearLottie: {
    width: 30,
    height: 30,
    right: 10,
  },

  clearIconText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* --- STYLES UNTUK CHAT --- */
  chatContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bubble: {
    padding: 14,
    marginVertical: 6,
    borderRadius: 20,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  userBubble: {
    backgroundColor: '#00A39D',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    elevation: 3,
    shadowColor: '#00A39D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  aiBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  text: {
    fontSize: 14.5,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#334155',
  },
  linkText: {
  color: '#2563EB',
  textDecorationLine: 'underline',
  fontWeight: '500',
},

  /* --- INPUT STYLES --- */
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  loadingText: {
    marginLeft: 8,
    color: '#64748B',
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputWrapper: {
    marginBottom: 90, // Jarak untuk navigasi bawah
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#E2F4F3',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E2A38',
    maxHeight: 100,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
  },
  sendButton: {
    backgroundColor: '#00A39D',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  bannerLottie: {
    width: 65,
    height: 65,
    right: 10,
  },

  /* --- CUSTOM MODAL STYLES --- */
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.6)', // Latar belakang sedikit digelapkan
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    width: '90%', // Diubah ke 90% agar membentuk kartu dialog yang cantik
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // Tambahan shadow untuk icon agar terlihat sedikit 3D
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800', // Dibuat lebih tebal
    color: '#1E2A38',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10, // Memberi jarak agar teks tidak terlalu mepet
  },
  modalBtnRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F8FAFC', // Abu-abu sangat terang
    borderWidth: 1.5,
    borderColor: '#E2E8F0', // Tambahan border agar lebih tegas
    marginRight: 8,
    alignItems: 'center',
  },
  btnCancelText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 15,
  },
  btnConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    marginLeft: 8,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  btnConfirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});