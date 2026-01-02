import React, { useState } from 'react';
import { Alert } from 'react-native';
import API from '../services/api';
import RegisterForm from '../components/RegisterForm';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [hp, setHp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<any>();

  const register = async () => {
    if (!nama || !username || !password || !hp) {
      setError('Semua field wajib diisi');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await API.post('/register', {
        nama,
        username,
        password,
        hp,
      });

      Alert.alert(
        'Sukses',
        'Registrasi berhasil',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ],
        { cancelable: false },
      );
    } catch (err: any) {
      console.log('REGISTER ERROR:', err.response?.data);
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterForm
      nama={nama}
      username={username}
      hp={hp}
      password={password}
      error={error}
      loading={loading}
      onChangeNama={setNama}
      onChangeUsername={setUsername}
      onChangeHp={setHp}
      onChangePassword={setPassword}
      onSubmit={register}
    />
  );
};

export default RegisterScreen;
