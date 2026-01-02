import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API from '../services/api';
import LoginForm from '../components/LoginForm';
import HumanCheckModal from '../components/HumanCheckModal';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showHumanCheck, setShowHumanCheck] = useState(false);

  const navigation = useNavigation<any>();

  const handleSubmit = () => {
    if (!username || !password) {
      setError('Username dan password wajib diisi');
      return;
    }

    setError('');
    setShowHumanCheck(true);
  };

  const login = async () => {
    setLoading(true);

    try {
      const res = await API.post('/login', {
        username,
        password,
        human_nonce: Date.now(),
      });

      console.log('LOGIN RESPONSE:', res.data);

      await AsyncStorage.setItem('token', res.data.token);

      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

      API.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;

      navigation.replace('Home');
    } catch (err: any) {
      console.log('LOGIN ERROR:', err.response?.data);
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <>
      <LoginForm
        username={username}
        password={password}
        error={error}
        loading={loading}
        onChangeUsername={setUsername}
        onChangePassword={setPassword}
        onSubmit={handleSubmit}
        onGoRegister={goToRegister}
      />

      <HumanCheckModal
        visible={showHumanCheck}
        onSuccess={() => {
          setShowHumanCheck(false);
          login();
        }}
      />
    </>
  );
};

export default LoginScreen;
