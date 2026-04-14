// Path: src/styles/AI/BotStyle.ts (Sesuaikan dengan struktur foldermu)

import { StyleSheet, Platform } from 'react-native';

// --- MARKDOWN STYLES ---
export const markdownStyles = StyleSheet.create({
  body: {
    color: '#334155',
    fontSize: 14.5,
    lineHeight: 22,
  },
  strong: {
    fontWeight: 'bold',
    color: '#1E2A38',
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: '#00A39D',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  bullet_list: {
    marginTop: 4,
    marginBottom: 4,
  },
  code_inline: {
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    paddingHorizontal: 4,
    color: '#EF4444',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});

// --- MAIN STYLES ---
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F6' },
  container: { flex: 1, backgroundColor: '#F4F7F6' },

  // --- BANNER ---
  floatingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2F4F3',
    shadowColor: '#00A39D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 10,
    marginTop: 20,
    elevation: 3,
  },
  bannerInfo: { flexDirection: 'row', alignItems: 'center' },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#1E2A38' },
  bannerSubtitle: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  bannerLottie: { width: 50, height: 50, marginRight: 8 },
  clearLottie: { width: 30, height: 30 },

  // --- CHAT LAYOUT ---
  chatContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    width: '100%',
  },
  messageRowAI: { justifyContent: 'flex-start' },
  messageRowUser: { justifyContent: 'flex-end' },

  // --- AVATAR ---
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2F4F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  avatarEmoji: { fontSize: 18 },

  // --- BUBBLE ---
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: '#00A39D',
    borderBottomRightRadius: 4,
    elevation: 2,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userText: { color: '#FFFFFF', fontSize: 14.5, lineHeight: 22 },

  // --- TIMESTAMP ---
  timestampText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampUser: { color: '#D1FAE5' },
  timestampAI: { color: '#94A3B8' },

  // --- INPUT ---
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
  inputWrapper: { marginBottom: 90, paddingHorizontal: 16, paddingBottom: 10 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#E2F4F3',
    elevation: 3,
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
  },
  sendButtonDisabled: { backgroundColor: '#CBD5E1' },
  sendText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

  // --- MODAL ---
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E2A38',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    alignItems: 'center',
  },
  btnCancelText: { color: '#64748B', fontWeight: '700', fontSize: 15 },
  btnConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    marginLeft: 8,
    alignItems: 'center',
  },
  btnConfirmText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

  quickChatWrapper: {
    marginBottom: 12,
  },
  quickChatContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  quickChatButton: {
    backgroundColor: '#E2F4F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#00A39D',
  },
  quickChatButtonDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  quickChatText: {
    color: '#00A39D',
    fontSize: 13,
    fontWeight: '600',
  },
  quickChatTextDisabled: {
    color: '#94A3B8',
  },
});
