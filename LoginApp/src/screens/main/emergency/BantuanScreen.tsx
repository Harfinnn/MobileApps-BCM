import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { HelpCircle, ChevronDown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLayout } from '../../../contexts/LayoutContext';
import { styles } from '../../../styles/emergency/faqStyle';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    question: 'Apa itu SIMPEL BCM?',
    answer:
      'SIMPEL BCM adalah aplikasi Business Continuity Management yang membantu memantau risiko, melaporkan kejadian bencana, dan menjaga keberlangsungan operasional cabang secara real-time.',
  },
  {
    id: '2',
    question: 'Bagaimana cara melaporkan kejadian bencana?',
    answer:
      'Buka menu "Lapor Bencana" di Home, isi form deskripsi kejadian, lampirkan foto dan lokasi GPS, lalu tekan tombol Submit. Laporan akan langsung masuk ke tim monitoring.',
  },
  {
    id: '3',
    question: 'Kapan saya harus menggunakan Panggilan Darurat?',
    answer:
      'Gunakan fitur ini hanya untuk situasi darurat yang membutuhkan respon cepat, seperti kondisi yang mengancam keselamatan pegawai atau operasional cabang.',
  },
  {
    id: '4',
    question: 'Apa fungsi Akbar AI?',
    answer:
      'Akbar AI adalah chatbot yang bisa membantu mencari SOP, playbook, dan panduan terkait BCM secara cepat tanpa perlu mencari manual di dokumen.',
  },
  {
    id: '5',
    question: 'Bagaimana cara melihat status monitoring cabang?',
    answer:
      'Buka menu "Monitoring" untuk melihat peta indikator gempa, cuaca, banjir, dan status masing-masing cabang secara real-time.',
  },
  {
    id: '6',
    question: 'Kenapa saya tidak menerima notifikasi aplikasi?',
    answer:
      'Pastikan izin notifikasi untuk aplikasi SIMPEL BCM sudah diaktifkan di pengaturan perangkat, dan koneksi internet dalam kondisi stabil.',
  },
  {
    id: '7',
    question: 'Bagaimana cara mengganti password akun?',
    answer:
      'Masuk ke menu Profile, pilih "Ganti Password", lalu ikuti langkah verifikasi yang diminta.',
  },
  {
    id: '8',
    question: 'Siapa yang bisa saya hubungi jika mengalami kendala aplikasi?',
    answer:
      'Silakan hubungi admin BCM di cabang masing-masing, atau tim IT Support melalui kontak internal yang tersedia.',
  },
];

export default function BantuanScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setTitle('Bantuan / FAQ');
      setHideNavbar(true);
      setShowBack(true);
      setShowSearch(false);

      setOnBack(() => () => {
        navigation.goBack();
        return true;
      });

      return () => setOnBack(undefined);
    }, [
      navigation,
      setHideNavbar,
      setOnBack,
      setShowBack,
      setShowSearch,
      setTitle,
    ]),
  );

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.goBack();
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <LinearGradient
      colors={['#009B97', '#007A77']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <HelpCircle size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>Pusat Bantuan</Text>
        <Text style={styles.headerSubtitle}>
          Temukan jawaban seputar penggunaan SIMPEL BCM
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {FAQ_DATA.map(item => {
          const isOpen = expandedId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              style={styles.faqCard}
              onPress={() => toggleExpand(item.id)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <View
                  style={{
                    transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                  }}
                >
                  <ChevronDown size={18} color="#94A3B8" />
                </View>
              </View>

              {isOpen && <Text style={styles.faqAnswer}>{item.answer}</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}
