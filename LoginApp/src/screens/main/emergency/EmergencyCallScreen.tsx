import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Linking,
  Alert,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';
import styles from '../../../styles/emergency/emergencyCallStyle';
import {
  PhoneCall,
  ShieldAlert,
  Flame,
  Ambulance,
  Info,
} from 'lucide-react-native';

const EMERGENCY_NUMBERS = [
  {
    label: 'Ambulans',
    number: '119',
    color: '#FEF2F2',
    accent: '#EF4444',
    icon: <Ambulance color="#EF4444" size={30} />,
  },
  {
    label: 'Pemadam Kebakaran',
    number: '113',
    color: '#FFF7ED',
    accent: '#F97316',
    icon: <Flame color="#F97316" size={30} />,
  },
  {
    label: 'Polisi',
    number: '110',
    color: '#EFF6FF',
    accent: '#3B82F6',
    icon: <ShieldAlert color="#3B82F6" size={30} />,
  },
  {
    label: 'SAR / Bencana',
    number: '129',
    color: '#ECFDF5',
    accent: '#10B981',
    icon: <PhoneCall color="#10B981" size={30} />,
  },
];

const EmergencyCallScreen = () => {
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();

  useEffect(() => {
    setTitle('Emergency');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);

    const goHome = () => {
      navigation.navigate('Main', { screen: 'Home' });
      return true;
    };

    setOnBack(() => goHome);
    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
    };
  }, [navigation, setTitle, setHideNavbar, setShowBack, setOnBack]);

  const callNumber = (number: string, label: string) => {
    Alert.alert(
      'Konfirmasi Panggilan',
      `Hubungi ${label} di nomor ${number}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Panggil',
          onPress: () => Linking.openURL(`tel:${number}`),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={styles.topRow}>
            <Text style={styles.title}>Layanan Darurat</Text>
          </View>
          <Text style={styles.subtitle}>
            Klik pada layanan yang dibutuhkan. Tetap tenang dan berikan
            informasi lokasi Anda dengan jelas kepada petugas.
          </Text>
        </View>

        <View style={styles.list}>
          {EMERGENCY_NUMBERS.map(item => (
            <Pressable
              key={item.number}
              onPress={() => callNumber(item.number, item.label)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: item.color,
                  borderColor: item.accent + '20',
                },
                { transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: '#FFFFFF' }]}
              >
                {item.icon}
              </View>

              <View style={styles.contentContainer}>
                <Text style={[styles.cardLabel, { color: item.accent }]}>
                  {item.label}
                </Text>
                <Text style={styles.cardNumber}>{item.number}</Text>
              </View>

              <View
                style={[styles.callAction, { backgroundColor: item.accent }]}
              >
                <PhoneCall color="white" size={18} />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Penyalahgunaan nomor darurat dapat dikenakan sanksi. Gunakan hanya
            saat benar-benar dibutuhkan.
          </Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmergencyCallScreen;
