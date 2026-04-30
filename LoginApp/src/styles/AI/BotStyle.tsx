// Path: src/styles/AI/BotStyle.ts (Sesuaikan dengan struktur foldermu)

import { StyleSheet, Platform } from 'react-native';
import { normalize } from '../../utils/responsive';

// --- MARKDOWN STYLES ---
export const markdownStyles = StyleSheet.create({
  body: {
    color: '#334155',
    fontSize: normalize(14.5),
    lineHeight: normalize(22),
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
    borderRadius: normalize(4),
    paddingHorizontal: normalize(4),
    color: '#EF4444',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});

// --- MAIN STYLES ---
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, backgroundColor: '#F4F7F6' },

  // --- BANNER ---
  floatingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: normalize(14),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(14),
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: '#E2F4F3',
    shadowColor: '#00A39D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: normalize(10),
    marginTop: normalize(20),
    elevation: 3,
  },
  bannerInfo: { flexDirection: 'row', alignItems: 'center' },
  bannerTitle: {
    fontSize: normalize(16),
    fontWeight: '700',
    color: '#1E2A38',
  },
  bannerSubtitle: {
    fontSize: normalize(12),
    color: '#64748B',
    fontWeight: '500',
  },
  bannerLottie: {
    width: normalize(50),
    height: normalize(50),
    marginRight: normalize(8),
  },
  clearLottie: {
    width: normalize(30),
    height: normalize(30),
  },

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
    width: normalize(32), // Ukuran avatar dinamis
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: '#E2F4F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(8),
    marginBottom: normalize(4),
  },
  avatarEmoji: { fontSize: normalize(18) },

  // --- BUBBLE ---
  bubble: {
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(10),
    borderRadius: normalize(20),
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
  userText: {
    color: '#FFFFFF',
    fontSize: normalize(14.5), // Teks user dinamis
    lineHeight: normalize(22),
  },

  // --- TIMESTAMP ---
  timestampText: {
    fontSize: normalize(10), // Waktu kecil tapi tetap terbaca
    marginTop: normalize(4),
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
  inputWrapper: { paddingHorizontal: 16, paddingBottom: 10 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(24),
    paddingLeft: normalize(16),
    paddingRight: normalize(8),
    paddingVertical: normalize(8),
    borderWidth: 1.5,
    borderColor: '#E2F4F3',
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: normalize(15), // Teks input dinamis
    color: '#1E2A38',
    maxHeight: normalize(100),
    paddingTop: Platform.OS === 'ios' ? normalize(10) : normalize(8),
    paddingBottom: Platform.OS === 'ios' ? normalize(10) : normalize(8),
  },
  sendButton: {
    backgroundColor: '#00A39D',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(10),
    borderRadius: normalize(20),
    marginLeft: normalize(8),
  },
  sendButtonDisabled: { backgroundColor: '#CBD5E1' },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: normalize(14),
  },
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
    maxWidth: normalize(400), // Batasi lebar maksimal agar tidak terlalu lebar di Tablet
    borderRadius: normalize(24),
    padding: normalize(24),
    alignItems: 'center',
    elevation: 10,
  },
  modalIconContainer: {
    width: normalize(64),
    height: normalize(64),
    borderRadius: normalize(32),
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: '#1E2A38',
    marginBottom: normalize(8),
  },
  modalDesc: {
    fontSize: normalize(14),
    color: '#64748B',
    textAlign: 'center',
    lineHeight: normalize(22),
    marginBottom: normalize(24),
  },
  modalBtnRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  btnCancel: {
    flex: 1,
    paddingVertical: normalize(14),
    borderRadius: normalize(16),
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: normalize(8),
    alignItems: 'center',
  },
  btnCancelText: { color: '#64748B', fontWeight: '700', fontSize: 15 },
  btnConfirm: {
    flex: 1,
    paddingVertical: normalize(14),
    borderRadius: normalize(16),
    backgroundColor: '#EF4444',
    marginLeft: normalize(8),
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
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
    marginRight: normalize(10),
    borderWidth: 1,
    borderColor: '#00A39D',
  },
  quickChatButtonDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  quickChatText: {
    color: '#00A39D',
    fontSize: normalize(13),
    fontWeight: '600',
  },
  quickChatTextDisabled: {
    color: '#94A3B8',
  },
});
