import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import API from '../../../services/api';
import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import YesNoToggle from '../../../components/common/YesNoToggle';

// IMPORT STYLES DARI FILE TERPISAH
import styles from '../../../styles/bencana/laporBencanaStyle';

/* ================= TYPES ================= */
type Bencana = {
  mbe_id: number;
  mbe_nama: string;
  mbe_warna: string;
  mbe_icon: string;
};

type FormState = {
  userId: number | null;
  nama: string;
  unitKerjaId: number | null;
  unitKerjaNama: string;
  jenisBencana: number | null;
  lokasi: string;
  terdampak: boolean;
  adaKerusakan: boolean;
};

type AlertState = {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error';
};

const LaporBencanaScreen = () => {
  const { setTitle, setHideNavbar, setShowBack, setShowSearch } = useLayout();
  const { user } = useUser();
  const navigation = useNavigation<any>();

  const [form, setForm] = useState<FormState>({
    userId: null,
    nama: '',
    unitKerjaId: null,
    unitKerjaNama: '',
    jenisBencana: null,
    lokasi: '',
    terdampak: false,
    adaKerusakan: false,
  });

  const [bencanaList, setBencanaList] = useState<Bencana[]>([]);
  const [foto, setFoto] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showJenisModal, setShowJenisModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    setTitle('Lapor Bencana');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);
    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        userId: user.user_id ?? null,
        nama: user.user_nama ?? '',
        unitKerjaId: user.selindo?.mjs_id ?? user.user_selindo ?? null,
        unitKerjaNama: user.selindo?.mjs_nama ?? '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const initData = async () => {
      setIsLocating(true);
      const allowed = await requestLocationPermission();
      if (allowed) {
        Geolocation.getCurrentPosition(
          pos => {
            setForm(prev => ({
              ...prev,
              lokasi: `${pos.coords.latitude},${pos.coords.longitude}`,
            }));
            setIsLocating(false);
          },
          () => setIsLocating(false),
          { enableHighAccuracy: true, timeout: 15000 },
        );
      } else {
        setIsLocating(false);
      }
      fetchBencana();
    };
    initData();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Izin Kamera',
        message: 'Aplikasi membutuhkan akses kamera untuk mengambil foto',
        buttonPositive: 'Izinkan',
        buttonNegative: 'Batal',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const fetchBencana = async () => {
    try {
      const res = await API.get('/bencana');
      if (res.data.success) {
        const unique = Object.values(
          res.data.data.reduce((acc: any, item: any) => {
            acc[item.mbe_id] = item;
            return acc;
          }, {}),
        );
        setBencanaList(unique as any);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const ambilFoto = async () => {
    const allowed = await requestCameraPermission();
    if (!allowed) return;

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.6,
      saveToPhotos: false,
    });

    if (result.didCancel) return;

    if (result.assets?.length) {
      setFoto(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!form.jenisBencana) {
      setErrors({ jenisBencana: 'Harap pilih jenis bencana' });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('unit_kerja_id', String(form.unitKerjaId));
      formData.append('unit_kerja_nama', form.unitKerjaNama);
      formData.append('mbe_id', String(form.jenisBencana));
      formData.append('terdampak', form.terdampak ? '1' : '0');
      formData.append('ada_kerusakan', form.adaKerusakan ? '1' : '0');
      formData.append('lokasi', form.lokasi || '');
      if (foto)
        formData.append('foto', {
          uri: foto.uri,
          type: foto.type || 'image/jpeg',
          name: 'report.jpg',
        } as any);

      await API.post('/lapor-bencana', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAlertState({
        visible: true,
        title: 'Berhasil',
        message: 'Laporan Anda telah terkirim.',
        type: 'success',
      });
    } catch (err) {
      setAlertState({
        visible: true,
        title: 'Gagal',
        message: 'Gagal mengirim laporan.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBencana = bencanaList.find(b => b.mbe_id === form.jenisBencana);

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lapor Bencana</Text>
          <Text style={styles.headerSub}>
            Berikan detail informasi secara akurat
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Identitas Pelapor</Text>
          <View style={styles.readOnlyContainer}>
            <View style={styles.readOnlyRow}>
              <Text style={styles.readOnlyLabel}>Nama</Text>
              <Text style={styles.readOnlyValue}>{form.nama || '-'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.readOnlyRow}>
              <Text style={styles.readOnlyLabel}>Unit Kerja</Text>
              <Text style={styles.readOnlyValue}>
                {form.unitKerjaNama || '-'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Detail Kejadian</Text>
          <Text style={styles.fieldLabel}>Jenis Bencana</Text>
          <TouchableOpacity
            style={[styles.selector, errors.jenisBencana && styles.errorBorder]}
            onPress={() => setShowJenisModal(true)}
          >
            <Text
              style={[
                styles.selectorText,
                !form.jenisBencana && styles.placeholder,
              ]}
            >
              {selectedBencana?.mbe_nama ?? 'Pilih jenis bencana'}
            </Text>
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>
          {errors.jenisBencana && (
            <Text style={styles.errorText}>{errors.jenisBencana}</Text>
          )}

          <View style={styles.locationBadge}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isLocating ? '#F59E0B' : '#00A39D' },
              ]}
            />
            <Text style={styles.locationText}>
              {isLocating
                ? 'Mencari GPS...'
                : `Lokasi: ${form.lokasi || 'GPS Tidak Terdeteksi'}`}
            </Text>
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Apakah terdampak?</Text>
              <Text style={styles.toggleSub}>
                Centang jika Anda terkena imbas
              </Text>
            </View>
            <YesNoToggle
              value={form.terdampak}
              onChange={v => onChange('terdampak', v)}
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Apakah ada kerusakan?</Text>
              <Text style={styles.toggleSub}>Bangunan/Fasilitas Kantor</Text>
            </View>
            <YesNoToggle
              value={form.adaKerusakan}
              onChange={v => {
                onChange('adaKerusakan', v);
                if (!v) setFoto(null);
              }}
            />
          </View>

          {form.adaKerusakan && (
            <View style={styles.photoContainer}>
              <TouchableOpacity style={styles.uploadBox} onPress={ambilFoto}>
                {foto ? (
                  <Image
                    source={{ uri: foto.uri }}
                    style={styles.photoPreview}
                  />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={{ fontSize: 28 }}>📷</Text>
                    <Text style={styles.uploadText}>Ambil Foto Kerusakan</Text>
                  </View>
                )}
              </TouchableOpacity>
              {foto && (
                <TouchableOpacity onPress={() => setFoto(null)}>
                  <Text style={styles.removePhoto}>Hapus & Foto Ulang</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.btnSubmit, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.btnSubmitText}>Kirim Laporan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL JENIS BENCANA */}
      <Modal visible={showJenisModal} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Pilih Jenis Bencana</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {bencanaList.map(item => (
                <TouchableOpacity
                  key={item.mbe_id}
                  style={[
                    styles.sheetItem,
                    form.jenisBencana === item.mbe_id && styles.sheetItemActive,
                  ]}
                  onPress={() => {
                    onChange('jenisBencana', item.mbe_id);
                    setShowJenisModal(false);
                    setErrors({});
                  }}
                >
                  <Text
                    style={[
                      styles.sheetItemText,
                      form.jenisBencana === item.mbe_id &&
                        styles.sheetItemTextActive,
                    ]}
                  >
                    {item.mbe_nama}
                  </Text>
                  {form.jenisBencana === item.mbe_id && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.sheetCloseBtn}
              onPress={() => setShowJenisModal(false)}
            >
              <Text style={styles.sheetCloseText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ALERT MODAL */}
      <Modal visible={alertState.visible} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertCard}>
            <Text
              style={[
                styles.alertTitle,
                {
                  color: alertState.type === 'success' ? '#00A39D' : '#EF4444',
                },
              ]}
            >
              {alertState.title}
            </Text>
            <Text style={styles.alertMsg}>{alertState.message}</Text>
            <TouchableOpacity
              style={styles.alertBtn}
              onPress={() => {
                setAlertState({ ...alertState, visible: false });
                if (alertState.type === 'success')
                  navigation.navigate('Main', { screen: 'Home' });
              }}
            >
              <Text style={styles.alertBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LaporBencanaScreen;
