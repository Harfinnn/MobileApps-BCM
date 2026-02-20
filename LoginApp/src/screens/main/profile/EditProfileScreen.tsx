import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Camera, User, Phone, Save } from 'lucide-react-native';

import API from '../../../services/api';
import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import { resolveImageUri } from '../../../utils/image';

import Avatar from '../../../components/common/Avatar';
import { styles } from '../../../styles/profile/editProfileStyle';

export default function EditProfileScreen({ navigation }: any) {
  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();
  const { user, setUser } = useUser();

  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNama(user.user_nama ?? '');
      setHp((user as any)?.user_hp ?? '');
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setTitle('Edit Profile');
      setHideNavbar(true);
      setShowBack(true);
      setShowSearch(false);
      setOnBack(() => () => {
        navigation.navigate('Main', { screen: 'Profile' });
        return true;
      });
      return () => {
        setOnBack(undefined);
        setShowSearch(true);
      };
    }, [
      navigation,
      setTitle,
      setHideNavbar,
      setShowBack,
      setOnBack,
      setShowSearch,
    ]),
  );

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const openCamera = async () => {
    const allowed = await requestCameraPermission();
    if (!allowed) return;
    setPhotoLoading(true);
    const res = await launchCamera({
      mediaType: 'photo',
      quality: 0.7,
      cameraType: 'front',
    });
    if (res.assets?.length) setPhoto(res.assets[0]);
    setPhotoLoading(false);
  };

  const openGallery = async () => {
    setPhotoLoading(true);
    const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    if (res.assets?.length) setPhoto(res.assets[0]);
    setPhotoLoading(false);
  };

  const pickPhoto = () => {
    Alert.alert('Foto Profil', 'Pilih sumber foto', [
      { text: 'Kamera', onPress: openCamera },
      { text: 'Galeri', onPress: openGallery },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  const submit = async () => {
    if (!nama || !hp) {
      Alert.alert('Error', 'Nama dan No HP wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_nama', nama);
      formData.append('user_hp', hp);
      if (photo) {
        formData.append('user_foto', {
          uri: photo.uri,
          type: photo.type || 'image/jpeg',
          name: photo.fileName || 'profile.jpg',
        } as any);
      }
      await API.post('/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const me = await API.get('/profile');
      await setUser(me.data);
      
      navigation.navigate('Main', { screen: 'Profile' });
    } catch (err: any) {
      Alert.alert('Gagal', err?.response?.data?.message ?? 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const avatarUri = useMemo(
    () => (photo?.uri ? photo.uri : resolveImageUri(user?.user_foto)),
    [photo?.uri, user?.user_foto],
  );
  const initial = useMemo(
    () => (nama ? nama.charAt(0).toUpperCase() : 'U'),
    [nama],
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#009B97" />

      {/* HEADER VISUAL */}
      <LinearGradient
        colors={['#009B97', '#007A77']}
        style={styles.headerCurve}
      />

      {/* HEADER CONTENT (TIDAK SCROLL) */}
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={pickPhoto}
          activeOpacity={0.9}
        >
          <View style={styles.avatarRing}>
            <Avatar uri={avatarUri} initial={initial} size={110} />
          </View>

          <View style={styles.cameraIconBadge}>
            <Camera size={18} color="#FFF" />
          </View>

          {photoLoading && (
            <View style={styles.avatarLoadingOverlay}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Informasi Profil</Text>
      </View>

      {/* ===== SCROLLVIEW AMAN (FORM SAJA) ===== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.card}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={nama}
              onChangeText={setNama}
              placeholder="Masukkan nama lengkap"
            />
          </View>

          <Text style={styles.label}>No Handphone</Text>
          <View style={styles.inputContainer}>
            <Phone size={20} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={hp}
              onChangeText={setHp}
              keyboardType="phone-pad"
              placeholder="0812..."
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Save size={20} color="#111827" style={{ marginRight: 8 }} />
              <Text style={styles.btnText}>Simpan Perubahan</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
