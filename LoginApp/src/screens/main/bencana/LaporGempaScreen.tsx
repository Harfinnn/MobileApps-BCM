import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import API from '../../../services/api';
import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';

import YesNoToggle from '../../../components/common/YesNoToggle';
import styles from '../../../styles/bencana/laporGempaStyle';

type FormState = {
  userId: number | null;
  nama: string;
  noHp: string;
  unitKerjaId: number | null;
  unitKerjaNama: string;
  lokasi: string;
  terdampak: boolean | null;
  adaKerusakan: boolean | null;
};

const LaporGempaScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const gempaData = route.params?.gempaData;

  console.log('ISI DATA GEMPA DARI ROUTE:', JSON.stringify(gempaData, null, 2));

  const { setTitle, setHideNavbar, setShowBack, setHideHeader } = useLayout();
  const { user } = useUser();

  const [form, setForm] = useState<FormState>({
    userId: null,
    nama: '',
    noHp: '',
    unitKerjaId: null,
    unitKerjaNama: '',
    lokasi: '',
    terdampak: null,
    adaKerusakan: null,
  });

  const [foto, setFoto] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // --- 1. SETUP UI & BACK BUTTON ---
  useEffect(() => {
    setTitle('Lapor Gempa');
    setHideNavbar(true);
    setHideHeader(true);
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => {
      setHideNavbar(false);
      setShowBack(false);
      backHandler.remove();
    };
  }, []);

  // --- 2. SET USER DATA ---
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        userId: user.user_id ?? null,
        nama: user.user_nama ?? '',
        noHp: user.user_hp ?? '',
        unitKerjaId: user.selindo?.mjs_id ?? user.user_selindo ?? null,
        unitKerjaNama: user.selindo?.mjs_nama ?? '',
      }));
    }
  }, [user]);

  // --- 3. GPS LOGIC (OPTIMIZED) ---
  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  };

  const getLocation = async () => {
    setIsLocating(true);
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      setIsLocating(false);
      setForm(prev => ({ ...prev, lokasi: 'Izin GPS ditolak' }));
      return;
    }

    // Mencoba High Accuracy (Satelit)
    Geolocation.getCurrentPosition(
      pos => {
        setForm(prev => ({
          ...prev,
          lokasi: `${pos.coords.latitude},${pos.coords.longitude}`,
        }));
        setIsLocating(false);
      },
      error => {
        console.log('GPS High Accuracy gagal, mencoba Low Accuracy...', error);
        // Fallback: Mencoba Low Accuracy (Wifi/Cellular) jika satelit gagal/timeout
        Geolocation.getCurrentPosition(
          pos => {
            setForm(prev => ({
              ...prev,
              lokasi: `${pos.coords.latitude},${pos.coords.longitude}`,
            }));
            setIsLocating(false);
          },
          err => {
            console.log('Semua metode GPS gagal:', err);
            setIsLocating(false);
            setForm(prev => ({ ...prev, lokasi: 'Gagal mendapatkan lokasi' }));
          },
          { enableHighAccuracy: false, timeout: 10000 },
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // --- 4. CAMERA LOGIC ---
  const ambilFoto = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Izin Ditolak', 'Kamera tidak bisa dibuka tanpa izin.');
        return;
      }
    }

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.6,
      saveToPhotos: false,
    });

    if (result.assets && result.assets.length > 0) {
      setFoto(result.assets[0]);
      setErrors((prev: any) => ({ ...prev, foto: null }));
    }
  };

  // --- 5. SUBMIT LOGIC ---
  const handleSubmit = async () => {
    const newErrors: any = {};
    if (form.terdampak === null) newErrors.terdampak = 'Pilih Ya atau Tidak';
    if (form.adaKerusakan === null)
      newErrors.adaKerusakan = 'Pilih Ya atau Tidak';
    if (form.adaKerusakan && !foto) newErrors.foto = 'Foto kerusakan wajib ada';

    // Cek jika lokasi gagal didapat
    if (
      !form.lokasi ||
      form.lokasi.includes('Gagal') ||
      form.lokasi.includes('ditolak')
    ) {
      Alert.alert(
        'Lokasi Diperlukan',
        'Harap pastikan lokasi Anda terdeteksi sebelum mengirim laporan.',
      );
      return;
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('unit_kerja_id', String(form.unitKerjaId));
      formData.append('unit_kerja_nama', form.unitKerjaNama);
      formData.append('mbe_id', '1');
      formData.append('terdampak', form.terdampak ? '1' : '0');
      formData.append('ada_kerusakan', form.adaKerusakan ? '1' : '0');
      formData.append('lokasi', form.lokasi);
      formData.append('source', 'gempa');

      // 🔥 INI BAGIAN YANG SUDAH DIPERBAIKI 🔥
      if (gempaData) {
        formData.append('gempa_ref', `${gempaData.tanggal}-${gempaData.jam}`);
        
        formData.append('magnitude', gempaData.magnitude);
        formData.append('kedalaman', gempaData.kedalaman);
        formData.append('wilayah_gempa', gempaData.wilayah);
      }

      if (foto) {
        formData.append('foto', {
          uri:
            Platform.OS === 'android'
              ? foto.uri
              : foto.uri.replace('file://', ''),
          type: foto.type || 'image/jpeg',
          name: foto.fileName || 'gempa.jpg',
        } as any);
      }

      const response = await API.post('/lapor-bencana', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        transformRequest: data => data,
      });

      // --- BAGIAN NOTIFIKASI BERHASIL ---
      await AsyncStorage.setItem('GEMPA_REPORT_STATUS', 'done');

      Alert.alert(
        'Berhasil',
        'Laporan Anda telah berhasil terkirim ke sistem.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Main', {
                screen: 'Home',
                params: { reportDone: true },
              });
            },
          },
        ],
      );
    } catch (err: any) {
      // --- BAGIAN NOTIFIKASI GAGAL ---
      console.log('UPLOAD ERROR:', err.response?.data || err.message);

      const errorMessage =
        err.response?.data?.message ||
        'Terjadi kesalahan koneksi saat mengirim laporan.';

      Alert.alert('Gagal Mengirim', errorMessage, [{ text: 'Coba Lagi' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#C62828" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Laporan Gempa</Text>
        <Text style={styles.headerSubtitle}>
          Pantau Keamanan & Kirim Kondisi
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. BMKG DATA */}
        {gempaData && (
          <View style={styles.alertCard}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      parseFloat(gempaData.magnitude) >= 5
                        ? '#ff4d4d'
                        : '#ffa500',
                  },
                ]}
              >
                <Text style={styles.badgeText}>Info Gempa Terkini</Text>
              </View>
              <Text style={styles.timeText}>{gempaData.jam} WIB</Text>
            </View>
            <View style={styles.mainInfo}>
              <View style={styles.magContainer}>
                <Text style={styles.magValue}>{gempaData.magnitude}</Text>
                <Text style={styles.magUnit}>SR</Text>
              </View>
              <View style={styles.locationContainer}>
                <Text style={styles.alertLocation} numberOfLines={2}>
                  {gempaData.wilayah}
                </Text>
                <Text style={styles.coordinatesText}>
                  {gempaData.coordinates}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 2. LOCATION & ID */}
        <View style={styles.groupContainer}>
          <TouchableOpacity
            style={styles.locationCard}
            onPress={getLocation}
            disabled={isLocating}
          >
            <View style={styles.locationHeader}>
              <Text style={styles.locationTitle}>📍 Lokasi Anda</Text>
              {isLocating && <ActivityIndicator size="small" color="#00695C" />}
            </View>
            <View style={styles.locationContent}>
              <Text style={styles.locationText}>
                {isLocating
                  ? 'Sedang melacak posisi...'
                  : form.lokasi || 'Klik untuk lacak ulang'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.miniIdentityCard}>
            <View style={styles.miniInfoItem}>
              <Text style={styles.miniLabel}>Nama Pelapor</Text>
              <Text style={styles.miniValue} numberOfLines={1}>
                {form.nama || '-'}
              </Text>
            </View>
            <View
              style={[
                styles.miniInfoItem,
                {
                  borderLeftWidth: 1,
                  borderLeftColor: '#E0E0E0',
                  paddingLeft: 12,
                },
              ]}
            >
              <Text style={styles.miniLabel}>Unit Bisnis</Text>
              <Text style={styles.miniValue} numberOfLines={1}>
                {form.unitKerjaNama || '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. FORM QUESTIONS */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kondisi & Dampak</Text>
            <View style={styles.lineDecoration} />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>
              Apakah Anda merasakan getaran?
            </Text>
            <YesNoToggle
              value={form.terdampak}
              onChange={v => setForm(prev => ({ ...prev, terdampak: v }))}
            />
            {errors.terdampak && (
              <Text style={styles.errorText}>{errors.terdampak}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>
              Apakah ada kerusakan bangunan?
            </Text>
            <YesNoToggle
              value={form.adaKerusakan}
              onChange={v => setForm(prev => ({ ...prev, adaKerusakan: v }))}
            />
            {errors.adaKerusakan && (
              <Text style={styles.errorText}>{errors.adaKerusakan}</Text>
            )}
          </View>
        </View>

        {/* 4. PHOTO UPLOAD */}
        {form.adaKerusakan && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bukti Foto Kerusakan</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.photoButton,
                errors.foto && { borderColor: '#D32F2F' },
              ]}
              onPress={ambilFoto}
            >
              {foto ? (
                <Image source={{ uri: foto.uri }} style={styles.previewImage} />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 32 }}>📸</Text>
                  <Text style={styles.photoText}>Klik untuk ambil foto</Text>
                </View>
              )}
            </TouchableOpacity>
            {errors.foto && <Text style={styles.errorText}>{errors.foto}</Text>}
          </View>
        )}

        <View style={styles.footerAction}>
          <Text style={styles.disclaimerText}>
            Laporan Anda akan diteruskan ke pusat komando.
          </Text>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (isSubmitting || isLocating) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || isLocating}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitText}>KIRIM LAPORAN</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LaporGempaScreen;
