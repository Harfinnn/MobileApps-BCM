import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';
import { useLayout } from '../../contexts/LayoutContext';
import Toast from 'react-native-toast-message';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfileScreen({ navigation }: any) {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();
  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<any>(null);

  useEffect(() => {
    setTitle('Edit Profile');
    setHideNavbar(true);
    setShowBack(true);

    const loadUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setNama(user.user_nama);
        setHp(user.user_hp);
      }
    };

    loadUser();

    return () => {
      setHideNavbar(false);
      setShowBack(true);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  const pickImage = async () => {
    const res = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!res.didCancel && res.assets?.length) {
      setPhoto(res.assets[0]);
    }
  };

  const submit = async () => {
    if (!nama || !hp) {
      Alert.alert('Error', 'Nama dan hp wajib diisi');
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
          type: photo.type,
          name: photo.fileName || 'profile.jpg',
        } as any);
      }

      const res = await API.post('/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 🔥 SIMPAN KE LOCAL
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

      // 🔥 KIRIM KE PROFILE
      navigation.navigate({
        name: 'Profile',
        params: {
          updatedUser: res.data.user,
        },
        merge: true,
      });

      Toast.show({
        type: 'success',
        text1: 'Berhasil',
        text2: 'Profile berhasil diperbarui',
      });

      navigation.goBack();
    } catch (err: any) {
      console.log('ERROR RESPONSE:', err.response?.data);
      console.log('ERROR STATUS:', err.response?.status);
      console.log('ERROR FULL:', err);

      Alert.alert(
        'Gagal',
        err.response?.data?.message ??
          JSON.stringify(err.response?.data) ??
          'Terjadi kesalahan',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {nama ? nama.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
        )}
        <Text style={styles.changePhoto}>Ubah Foto</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Nama Lengkap</Text>
      <TextInput style={styles.input} value={nama} onChangeText={setNama} />

      <Text style={styles.label}>No Handphone</Text>
      <TextInput
        style={styles.input}
        value={hp}
        onChangeText={setHp}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.6 }]}
        onPress={submit}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
    paddingTop: 100,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#374151',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#F8AD3CFF',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  btnText: {
    textAlign: 'center',
    color: '#111827',
    fontWeight: '600',
    fontSize: 16,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#374151',
  },
  changePhoto: {
    marginTop: 8,
    color: '#2563EB',
  },
});
