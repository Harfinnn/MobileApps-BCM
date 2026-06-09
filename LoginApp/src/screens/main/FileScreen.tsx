import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
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
  Linking,
  Alert,
  BackHandler,
  ScrollView,
  Keyboard,
} from 'react-native';
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

import CobChart from '../../components/AI/CobChart';
import StageChart from '../../components/AI/StageChart';
import IncidentChart from '../../components/AI/IncidentChart';
import DailyIncidentChart from '../../components/AI/DailyIncidentChart';
import MonthlyIncidentChart from '../../components/AI/MonthlyIncidentChart';

import { Dimensions } from 'react-native';
import { styles, markdownStyles } from '../../styles/AI/BotStyle';
import CobPredictionChart from '../../components/AI/CobPredictionChart';

type Message = {
  id: string;
  text?: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type?:
    | 'text'
    | 'chart'
    | 'compare_chart'
    | 'operational_risk'
    | 'incident_correlation';
  chartData?: any;
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
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth > 600;

  const formatTimeFromDB = (dateString?: string) => {
    if (!dateString) return getCurrentTime();
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return getCurrentTime(); // Fallback jika format invalid
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Navigasi dikembalikan ke standar normal
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    setHideHeader(true);
    return () => setHideHeader(false);
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

  // Scroll dikembalikan ke animasi standar
  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const copyMessage = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Teks Disalin', 'Pesan berhasil disalin ke clipboard.');
  };

  const executeClearChat = async () => {
    setShowDeleteModal(false);
    try {
      await clearChatHistory();
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

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      const response = await sendMessage(textToSend);

      if (response.type === 'chart' || response.type === 'compare_chart') {
        const newMessages: Message[] = [];

        if (response.message) {
          newMessages.push({
            id: Date.now().toString() + '_info',
            text: response.message,
            sender: 'ai',
            timestamp: getCurrentTime(),
            type: 'text',
          });
        }

        newMessages.push({
          id: Date.now().toString() + '_chart',
          sender: 'ai',
          timestamp: getCurrentTime(),
          type: response.type,
          chartData: response.data,
        });

        if (response.summary_text) {
          newMessages.push({
            id: Date.now().toString() + '_summary',
            text: response.summary_text,
            sender: 'ai',
            timestamp: getCurrentTime(),
            type: 'text',
          });
        }

        setMessages(prev => [...prev, ...newMessages]);
      }

      // =====================================
      // OPERATIONAL RISK
      // =====================================
      else if (response.type === 'operational_risk') {
        const aiMessage: Message = {
          id: Date.now().toString() + '_risk',
          sender: 'ai',
          timestamp: getCurrentTime(),
          type: 'operational_risk',
          chartData: response.data,
          text: response.reply,
        };

        setMessages(prev => [...prev, aiMessage]);
      } else if (response.type === 'incident_correlation') {
        const aiMessage: Message = {
          id: Date.now().toString() + '_correlation',
          sender: 'ai',
          timestamp: getCurrentTime(),
          type: 'text',
          text: response.summary,
        };

        setMessages(prev => [...prev, aiMessage]);
      } else if (response.type === 'incident_dashboard') {
        const newMessages: Message[] = [];

        // =====================================
        // SUMMARY
        // =====================================

        if (response.summary_context) {
          newMessages.push({
            id: Date.now().toString() + '_summary',
            text: response.summary_context,
            sender: 'ai',
            timestamp: getCurrentTime(),
            type: 'text',
          });
        }

        // =====================================
        // MULTI CHARTS
        // =====================================

        if (Array.isArray(response.charts)) {
          response.charts.forEach((chart: any, index: number) => {
            newMessages.push({
              id: Date.now().toString() + '_chart_' + index,
              sender: 'ai',
              timestamp: getCurrentTime(),
              type: 'chart',
              chartData: chart.data,
            });
          });
        }

        setMessages(prev => [...prev, ...newMessages]);
      } else if (response.type === 'incident_availability') {
        const aiMessage: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          timestamp: getCurrentTime(),
          type: 'text',
          text:
            `Availability Critical Activity Tahun ${response.data.tahun}\n\n` +
            `• Availability : ${response.data.availability_percentage}%\n` +
            `• Total Incident : ${response.data.total_incident}\n` +
            `• Total Downtime : ${response.data.total_downtime_minutes} menit\n` +
            `• Total Downtime (Jam) : ${response.data.total_downtime_hours} jam`,
        };

        setMessages(prev => [...prev, aiMessage]);
      } else if (response.type === 'incident_response_time') {
        const aiMessage: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          timestamp: getCurrentTime(),
          type: 'text',

          text:
            `Average BCM Response Time\n\n` +
            `• Average Response : ${response.data.average_response_minutes} menit\n` +
            `• Total Incident : ${response.data.total_incident}`,
        };

        setMessages(prev => [...prev, aiMessage]);
      } else if (response.type === 'incident_recovery_time') {
        const aiMessage: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          timestamp: getCurrentTime(),
          type: 'text',

          text:
            `Average Temporary Solution Time\n\n` +
            `• Average Temporary Solution : ${response.data.average_temporary_solution_minutes} menit\n` +
            `• Total Incident : ${response.data.total_incident}`,
        };

        setMessages(prev => [...prev, aiMessage]);
      } else if (response.type === 'incident_resolution_time') {

        const aiMessage: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          timestamp: getCurrentTime(),
          type: 'text',
          text:
            `Average Incident Resolution Time\n\n` +
            `• Average Resolution : ${response.data.average_resolution_minutes} menit\n` +
            `• Total Incident : ${response.data.total_incident}`,
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        const aiMessage: Message = {
          id: Date.now().toString() + '_ai',
          text: response.reply || response.message,
          sender: 'ai',
          timestamp: getCurrentTime(),
          type: 'text',
        };

        setMessages(prev => [...prev, aiMessage]);
      }

      scrollToBottom();
    } catch (error: any) {
      let errorMessage =
        'Maaf, gagal terhubung ke server atau terjadi kesalahan jaringan.';

      if (error.response && error.response.status === 429) {
        errorMessage =
          error.response.data?.reply ||
          '⚠️ Sistem mendeteksi pesan terlalu cepat. Mohon tunggu 1 menit.';
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '_warning',
          text: errorMessage,
          sender: 'ai',
          timestamp: getCurrentTime(),
          type: 'text',
        },
      ]);
      scrollToBottom();
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

  // INI ADALAH FUNGSI YANG MEMBUAT GRAFIK TIDAK HILANG SAAT RELOAD
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

        const formattedMessages = history.flatMap((item: any) => {
          let aiText = item.reply || '';
          let isChart = false;
          let chartData = null;
          let responseType: any = 'text';
          let summaryText = null;

          try {
            const parsedReply = JSON.parse(item.reply);
            if (
              parsedReply &&
              (parsedReply.type === 'chart' ||
                parsedReply.type === 'compare_chart')
            ) {
              isChart = true;
              responseType = parsedReply.type;
              aiText = parsedReply.message;
              chartData = parsedReply.data;
            }
          } catch (e) {
            // Abaikan jika balasan bukan JSON (teks biasa)
          }

          const msgs: Message[] = [
            {
              id: item.id + '_user',
              text: item.message,
              sender: 'user' as const,
              timestamp: formatTimeFromDB(item.created_at),
            },
          ];

          if (isChart) {
            if (aiText) {
              msgs.push({
                id: item.id + '_info',
                text: aiText,
                sender: 'ai' as const,
                timestamp: formatTimeFromDB(item.created_at),
                type: 'text',
              });
            }
            msgs.push({
              id: item.id + '_chart',
              sender: 'ai' as const,
              timestamp: formatTimeFromDB(item.created_at),
              type: responseType,
              chartData: chartData,
            });
            if (summaryText) {
              msgs.push({
                id: item.id + '_summary',
                text: summaryText,
                sender: 'ai' as const,
                timestamp: formatTimeFromDB(item.created_at),
                type: 'text',
              });
            }
          } else {
            msgs.push({
              id: item.id + '_ai',
              text: aiText,
              sender: 'ai' as const,
              timestamp: formatTimeFromDB(item.created_at),
              type: 'text',
            });
          }
          return msgs;
        });

        setMessages(formattedMessages);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 200);
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
          { paddingTop: insets.top, backgroundColor: 'transparent' },
        ]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={false}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <View style={styles.container}>
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
              onContentSizeChange={scrollToBottom}
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
                    {item.type === 'chart' ||
                    item.type === 'compare_chart' ||
                    item.type === 'operational_risk' ? (
                      <View
                        style={[
                          styles.bubble,
                          isAI ? styles.aiBubble : styles.userBubble,
                          {
                            width: screenWidth * (isTablet ? 0.7 : 0.85),
                            maxWidth: '100%',
                          },
                        ]}
                      >
                        {item.type === 'operational_risk' ? (
                          <View
                            style={{
                              backgroundColor: '#101827',
                              borderRadius: 16,
                              padding: 18,
                            }}
                          >
                            <Text
                              style={{
                                color: '#FFFFFF',
                                fontSize: 22,
                                fontWeight: 'bold',
                                marginBottom: 10,
                              }}
                            >
                              Operational Risk Assessment
                            </Text>

                            <Text
                              style={{
                                color:
                                  item.chartData?.risk_level === 'CRITICAL'
                                    ? '#EF4444'
                                    : item.chartData?.risk_level === 'HIGH'
                                    ? '#F59E0B'
                                    : '#10B981',

                                fontSize: 32,
                                fontWeight: 'bold',
                              }}
                            >
                              {item.chartData?.risk_level}
                            </Text>

                            <Text
                              style={{
                                color: '#D1D5DB',
                                marginTop: 8,
                                fontSize: 14,
                              }}
                            >
                              Risk Score: {item.chartData?.risk_score}
                            </Text>

                            <Text
                              style={{
                                color: '#D1D5DB',
                                marginTop: 4,
                                fontSize: 14,
                              }}
                            >
                              Total Incident: {item.chartData?.total_incident}
                            </Text>

                            <Text
                              style={{
                                color: '#D1D5DB',
                                marginTop: 4,
                                fontSize: 14,
                              }}
                            >
                              Total Downtime: {item.chartData?.total_downtime}{' '}
                              menit
                            </Text>

                            <View style={{ marginTop: 14 }}>
                              <Text
                                style={{
                                  color: '#FFFFFF',
                                  fontWeight: 'bold',
                                  marginBottom: 6,
                                }}
                              >
                                Risk Indicators
                              </Text>

                              {item.chartData?.reasons?.length > 0 ? (
                                item.chartData.reasons.map(
                                  (reason: string, idx: number) => (
                                    <Text
                                      key={idx}
                                      style={{
                                        color: '#FCA5A5',
                                        fontSize: 13,
                                        marginBottom: 4,
                                      }}
                                    >
                                      • {reason}
                                    </Text>
                                  ),
                                )
                              ) : (
                                <Text
                                  style={{
                                    color: '#9CA3AF',
                                    fontSize: 13,
                                  }}
                                >
                                  Tidak ditemukan indikator risiko signifikan.
                                </Text>
                              )}
                            </View>
                          </View>
                        ) : item.type === 'compare_chart' ? (
                          <View style={{ gap: 15 }}>
                            {Array.isArray(item.chartData) &&
                              item.chartData.map(
                                (singleChart: any, index: number) => (
                                  <CobChart
                                    key={index}
                                    chartData={singleChart}
                                  />
                                ),
                              )}
                          </View>
                        ) : item.chartData?.chart_category === 'incident' ? (
                          item.chartData?.chart_mode === 'daily_incident' ? (
                            <DailyIncidentChart data={item.chartData} />
                          ) : item.chartData?.chart_mode ===
                            'monthly_incident' ? (
                            <MonthlyIncidentChart data={item.chartData} />
                          ) : (
                            <IncidentChart chartData={item.chartData} />
                          )
                        ) : item.chartData?.datasets?.some(
                            (ds: any) => ds.name === 'Application',
                          ) ? (
                          <StageChart chartData={item.chartData} />
                        ) : item.chartData?.datasets?.some(
                            (ds: any) =>
                              ds.name.toLowerCase().includes('forecast') ||
                              ds.name.toLowerCase().includes('prediksi'),
                          ) ? (
                          <CobPredictionChart chartData={item.chartData} />
                        ) : (
                          <CobChart chartData={item.chartData} />
                        )}
                        <Text
                          style={[
                            styles.timestampText,
                            isAI ? styles.timestampAI : styles.timestampUser,
                          ]}
                        >
                          {item.timestamp}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={1}
                        onLongPress={() => item.text && copyMessage(item.text)}
                        delayLongPress={500}
                        style={[
                          styles.bubble,
                          isAI ? styles.aiBubble : styles.userBubble,
                          { maxWidth: isTablet ? '65%' : '80%' },
                        ]}
                      >
                        {isAI ? (
                          <Markdown style={markdownStyles}>
                            {item.text || ''}
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
                    )}
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
