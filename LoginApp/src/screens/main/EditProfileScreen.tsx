import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';
import { useLayout } from '../../contexts/LayoutContext';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUser } from '../../contexts/UserContext';
import { styles } from '../../styles/editProfileStyle';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function EditProfileScreen({ navigation }: any) {
  const { setTitle, setHideNavbar, setShowBack, setOnBack } = useLayout();
  const { setUser } = useUser();

  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.navigate('Main', { screen: 'Profile' });
          return true; 
        },
      );

      return () => {
        subscription.remove();
      };
    }, [navigation]),
  );

  useEffect(() => {
    setTitle('Edit Profile');
    setHideNavbar(true);
    setShowBack(true);

    const goToProfile = () => {
      navigation.navigate('Main', {
        screen: 'Profile',
      });
      return true;
    };

    setOnBack(() => goToProfile);

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
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [navigation, setTitle, setHideNavbar, setShowBack, setOnBack]);

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
      Alert.alert('Error', 'Nama dan no hp wajib diisi');
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

      setUser(res.data.user);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

      Toast.show({
        type: 'success',
        text1: 'Berhasil',
        text2: 'Profile berhasil diperbarui',
      });

      navigation.navigate('Main', {
        screen: 'Profile',
      });
    } catch (err: any) {
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
    <LinearGradient
      colors={['#009B97', '#F8AD3C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
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

      <View style={styles.card}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput style={styles.input} value={nama} onChangeText={setNama} />

        <Text style={styles.label}>No Handphone</Text>
        <TextInput
          style={styles.input}
          value={hp}
          onChangeText={setHp}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.6 }]}
        onPress={submit}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
