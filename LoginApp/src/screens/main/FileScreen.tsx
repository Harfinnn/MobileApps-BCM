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
  UIManager,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  getRemainingChat,
} from '../../services/chatService';
import { styles } from '../../styles/AI/BotStyle';
import { useLayout } from '../../contexts/LayoutContext';
import LottieView from 'lottie-react-native';
import ParsedText from 'react-native-parsed-text';
import Clipboard from '@react-native-clipboard/clipboard';

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
  const [remaining, setRemaining] = useState<number>(100);
  const flatListRef = useRef<FlatList>(null);

  const copyMessage = (text: string) => {
    Clipboard.setString(text);

    Alert.alert('Teks Disalin', 'Pesan berhasil disalin ke clipboard.');
  };

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

  useEffect(() => {
    const loadRemaining = async () => {
      try {
        const data = await getRemainingChat();
        setRemaining(data.remaining);
      } catch (err) {
        console.log(err);
      }
    };

    loadRemaining();
  }, []);

  const executeClearChat = async () => {
    setShowDeleteModal(false);

    try {
      await clearChatHistory();

      setMessages([
        {
          id: 'reset',
          text: 'Riwayat percakapan telah dibersihkan.',
          sender: 'ai',
        },
      ]);

      const data = await getRemainingChat();
      setRemaining(data.remaining);
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
      const response = await sendMessage(input);

      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        text: response.reply,
        sender: 'ai',
      };

      setMessages(prev => [...prev, aiMessage]);

      // 🔥 update realtime
      setRemaining(response.remaining);
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
    <>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.container}>
            {/* ===== FLOATING BANNER ===== */}
            <View style={styles.floatingBanner}>
              <View style={styles.bannerInfo}>
                <LottieView
                  source={require('../../assets/Robohead Loading.json')}
                  autoPlay
                  loop
                  resizeMode="contain"
                  style={styles.bannerLottie}
                />
                <View>
                  <Text style={styles.bannerTitle}>BCM-Assistant</Text>
                  <Text
                    style={[
                      styles.limitText,
                      remaining <= 10 && styles.limitDanger,
                    ]}
                  >
                    Limit Chat: {remaining}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowDeleteModal(true)}
                activeOpacity={0.7}
              >
                <LottieView
                  source={require('../../assets/Delete.json')}
                  autoPlay
                  loop={false}
                  style={styles.clearLottie}
                />
              </TouchableOpacity>
            </View>

            {/* ===== CHAT LIST ===== */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.chatContainer}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
  activeOpacity={0.8}
  onLongPress={() => copyMessage(item.text)}
  delayLongPress={300}
  style={[
    styles.bubble,
    item.sender === 'user'
      ? styles.userBubble
      : styles.aiBubble,
  ]}
>
                  {item.sender === 'ai' ? (
                    <ParsedText
                      style={[styles.text, styles.aiText]}
                      parse={[
                        {
                          type: 'url',
                          style: styles.linkText,
                          onPress: (url: string) => {
                            Linking.openURL(url);
                          },
                        },
                      ]}
                    >
                      {item.text}
                    </ParsedText>
                  ) : (
                    <Text style={[styles.text, styles.userText]}>
                      {item.text}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />

            {/* ===== LOADING ===== */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#00A39D" />
                <Text style={styles.loadingText}>
                  Asisten sedang mengetik...
                </Text>
              </View>
            )}

            {/* ===== INPUT ===== */}
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

      {/* ===== MODAL DI LUAR SAFEAREA ===== */}
      {showDeleteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* Tambahan Icon agar lebih menarik */}
            <View style={styles.modalIconContainer}>
              <Text style={{ fontSize: 28 }}>🗑️</Text>
            </View>

            <Text style={styles.modalTitle}>Hapus Riwayat?</Text>

            <Text style={styles.modalDesc}>
              Semua percakapan dengan BCM-Assistant akan dihapus permanen dan
              tidak dapat dikembalikan.
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.btnCancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnConfirm}
                onPress={executeClearChat}
                activeOpacity={0.7}
              >
                <Text style={styles.btnConfirmText}>Ya, Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

export default FileScreen;