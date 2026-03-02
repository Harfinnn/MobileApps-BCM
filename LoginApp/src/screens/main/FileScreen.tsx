import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  sendMessage,
  getChatHistory,
  clearChatHistory,
} from '../../services/chatService';
import { styles } from '../../styles/AI/BotStyle';
import { useLayout } from '../../contexts/LayoutContext';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

function FileScreen({ navigation }: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { setHideHeader } = useLayout();

  // State untuk Custom Modal Hapus Riwayat
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation]);

  useEffect(() => {
    setHideHeader(true);
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  const executeClearChat = async () => {
    setShowDeleteModal(false);
    try {
      await clearChatHistory();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages([
        {
          id: 'welcome',
          text: 'Halo 👋 Saya BCM-Assistant. Ada yang bisa saya bantu hari ini?',
          sender: 'ai',
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const reply = await sendMessage(input);

      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        text: reply,
        sender: 'ai',
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory();

        if (!history || history.length === 0) {
          setMessages([
            {
              id: 'welcome',
              text: 'Halo 👋 Saya BCM-Assistant. Ada yang bisa saya bantu terkait keberlangsungan operasional hari ini?',
              sender: 'ai',
            },
          ]);
          return;
        }

        const formattedMessages = history.flatMap((item: any) => [
          {
            id: item.id + '_user',
            text: item.message,
            sender: 'user' as const,
          },
          {
            id: item.id + '_ai',
            text: item.reply,
            sender: 'ai' as const,
          },
        ]);

        setMessages(formattedMessages);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      } catch (error) {
        console.log('Load history error:', error);
        setMessages([
          {
            id: 'welcome',
            text: 'Halo 👋 Saya BCM-Assistant. Ada yang bisa saya bantu terkait keberlangsungan operasional hari ini?',
            sender: 'ai',
          },
        ]);
      }
    };

    loadHistory();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />

      {/* --- CUSTOM MODAL POP-UP (Pengganti Alert Bawaan) --- */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconContainer}>
              <Text style={{ fontSize: 24 }}>🗑️</Text>
            </View>
            <Text style={styles.modalTitle}>Hapus Riwayat?</Text>
            <Text style={styles.modalDesc}>
              Semua percakapan dengan AI akan dihapus permanen. Tindakan ini
              tidak dapat dibatalkan.
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.btnCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnConfirm}
                onPress={executeClearChat}
              >
                <Text style={styles.btnConfirmText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* --- FLOATING STATUS BANNER (Solusi Teks Bertumpuk) --- */}
          {/* Banner ini akan muncul manis di bawah Global Header */}
          <View style={styles.floatingBanner}>
            <View style={styles.bannerInfo}>
              <Text style={styles.bannerAvatar}>🤖</Text>
              <View>
                <Text style={styles.bannerTitle}>BCM-Assistant</Text>
                <View style={styles.onlineBadge}>
                  <View style={styles.dot} />
                  <Text style={styles.bannerSubtitle}>Online</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShowDeleteModal(true)}
              style={styles.clearBtnIcon}
            >
              <Text style={styles.clearIconText}>Hapus Riwayat Chat</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.bubble,
                  item.sender === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    item.sender === 'user' ? styles.userText : styles.aiText,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            )}
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#00A39D" />
              <Text style={styles.loadingText}>Asisten sedang mengetik...</Text>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Tanya BCM-Assistant..."
                placeholderTextColor="#A0AAB5"
                style={styles.input}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  input.trim() === '' ? styles.sendButtonDisabled : null,
                ]}
                onPress={handleSend}
                disabled={input.trim() === ''}
              >
                <Text style={styles.sendText}>Kirim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default FileScreen;
