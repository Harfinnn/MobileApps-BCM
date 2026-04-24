import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
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
  BackHandler,
  LayoutAnimation,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Markdown from 'react-native-markdown-display';

import {
  sendMessage,
  getChatHistory,
  clearChatHistory,
} from '../../services/chatService';
import { useLayout } from '../../contexts/LayoutContext';

import { styles, markdownStyles } from '../../styles/AI/BotStyle';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
};

const TAB_HEIGHT = 90;

const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const QUICK_CHATS = [
  'Bagaimana cuaca hari ini?',
  'Apa isi tas siaga bencana?',
  'Tanda-tanda akan terjadi tsunami',
  'Cara berlindung saat gempa bumi',
  'Apa itu mitigasi bencana?',
];

function FileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { setHideHeader } = useLayout();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 60);
  };

  const copyMessage = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Teks Disalin', 'Pesan berhasil disalin ke clipboard.');
  };

  useLayoutEffect(() => {
    if (navigation) navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    setHideHeader(true);
    return () => setHideHeader(false);
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Main', { screen: 'Home' });
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [navigation]),
  );

  const executeClearChat = async () => {
    setShowDeleteModal(false);
    try {
      await clearChatHistory();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages([
        {
          id: 'reset',
          text: 'Riwayat percakapan telah dibersihkan.',
          sender: 'ai',
          timestamp: getCurrentTime(),
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const executeSend = async (textToSend: string) => {
    if (textToSend.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: getCurrentTime(),
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    scrollToBottom(); // 🔥 scroll setelah user kirim

    try {
      const response = await sendMessage(textToSend);

      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        text: response.reply,
        sender: 'ai',
        timestamp: getCurrentTime(),
      };

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages(prev => [...prev, aiMessage]);

      scrollToBottom(); // 🔥 scroll setelah AI balas
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    executeSend(input);
  };

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory();
        if (!history || history.length === 0) {
          setMessages([
            {
              id: 'welcome',
              text: 'Halo 👋 Saya Akbar-AI. **Ada yang bisa saya bantu** terkait keberlangsungan operasional hari ini?',
              sender: 'ai',
              timestamp: getCurrentTime(),
            },
          ]);
          return;
        }

        const formattedMessages = history.flatMap((item: any) => [
          {
            id: item.id + '_user',
            text: item.message,
            sender: 'user' as const,
            timestamp: item.timestamp || getCurrentTime(),
          },
          {
            id: item.id + '_ai',
            text: item.reply,
            sender: 'ai' as const,
            timestamp: item.replyTimestamp || getCurrentTime(),
          },
        ]);

        setMessages(formattedMessages);
        scrollToBottom();
      } catch (error) {
        setMessages([
          {
            id: 'welcome',
            text: 'Halo 👋 Saya Akbar-AI. Ada yang bisa saya bantu?',
            sender: 'ai',
            timestamp: getCurrentTime(),
          },
        ]);
      }
    };
    loadHistory();
  }, []);

  return (
    <>
      <View
        style={[
          styles.safeArea,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#F4F7F6" />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
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
                  <Text style={styles.bannerTitle}>Akbar-AI</Text>
                  <Text style={styles.bannerSubtitle}>Asisten Operasional</Text>
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

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              contentContainerStyle={[
                styles.chatContainer,
                { paddingBottom: insets.bottom + TAB_HEIGHT + 20 },
              ]}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => {
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: false });
                }, 80);
              }}
              onLayout={() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }}
              renderItem={({ item }) => {
                const isAI = item.sender === 'ai';
                return (
                  <View
                    style={[
                      styles.messageRow,
                      isAI ? styles.messageRowAI : styles.messageRowUser,
                    ]}
                  >
                    {isAI && (
                      <View style={styles.avatarContainer}>
                        <Text style={styles.avatarEmoji}>🤖</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onLongPress={() => copyMessage(item.text)}
                      delayLongPress={300}
                      style={[
                        styles.bubble,
                        isAI ? styles.aiBubble : styles.userBubble,
                      ]}
                    >
                      {isAI ? (
                        <Markdown
                          style={markdownStyles}
                          onLinkPress={url => {
                            Linking.openURL(url);
                            return true;
                          }}
                        >
                          {item.text}
                        </Markdown>
                      ) : (
                        <Text style={styles.userText}>{item.text}</Text>
                      )}

                      <Text
                        style={[
                          styles.timestampText,
                          isAI ? styles.timestampAI : styles.timestampUser,
                        ]}
                      >
                        {item.timestamp}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#00A39D" />
                <Text style={styles.loadingText}>
                  Akbar-AI sedang mengetik...
                </Text>
              </View>
            )}

            <View
              style={[
                styles.inputWrapper,
                {
                  paddingBottom:
                    insets.bottom + (keyboardVisible ? 10 : TAB_HEIGHT),
                },
              ]}
            >
              {messages.length <= 1 && (
                <View style={styles.quickChatWrapper}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.quickChatContainer}
                  >
                    {QUICK_CHATS.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.quickChatButton,
                          loading && styles.quickChatButtonDisabled,
                        ]}
                        onPress={() => executeSend(item)}
                        disabled={loading}
                      >
                        <Text
                          style={[
                            styles.quickChatText,
                            loading && styles.quickChatTextDisabled,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={{ paddingHorizontal: 16 }}>
                <View style={styles.inputContainer}>
                  <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ketik pesan..."
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
                    disabled={input.trim() === '' || loading}
                  >
                    <Text style={styles.sendText}>Kirim</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>

      {showDeleteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconContainer}>
              <Text style={{ fontSize: 28 }}>🗑️</Text>
            </View>
            <Text style={styles.modalTitle}>Hapus Riwayat?</Text>
            <Text style={styles.modalDesc}>
              Semua percakapan dengan Akbar-AI akan dihapus permanen.
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
      )}
    </>
  );
}

export default FileScreen;
