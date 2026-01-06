import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';
import { useLayout } from '../../contexts/LayoutContext';
import Toast from 'react-native-toast-message';

export default function EditProfileScreen({ navigation }: any) {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();

  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [loading, setLoading] = useState(false);

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
  }, [ setTitle, setHideNavbar, setShowBack]);

  const submit = async () => {
    if (!nama || !hp) {
      Alert.alert('Error', 'Nama dan hp wajib diisi');
      return;
    }

    setLoading(true);

    try {
      // 🔥 1. UPDATE LOCAL USER DULU (OPTIMISTIC)
      const oldUserString = await AsyncStorage.getItem('user');
      const oldUser = oldUserString ? JSON.parse(oldUserString) : {};

      const optimisticUser = {
        ...oldUser,
        user_nama: nama,
        user_hp: hp,
      };

      await AsyncStorage.setItem('user', JSON.stringify(optimisticUser));

      // 🔥 2. BALIK KE PROFILE LANGSUNG
      Toast.show({
        type: 'success',
        text1: 'Berhasil',
        text2: 'Profile berhasil diperbarui',
        position: 'top',
      });

      navigation.goBack();

      navigation.navigate({
        name: 'Profile',
        params: {
          updatedUser: {
            user_nama: nama,
            user_hp: hp,
          },
        },
        merge: true,
      });

      // 🔥 3. API JALAN DI BELAKANG
      await API.post('/profile/update', {
        user_nama: nama,
        user_hp: hp,
      });
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message ?? 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
});
