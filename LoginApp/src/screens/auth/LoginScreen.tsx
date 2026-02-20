import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API from '../../services/api';

import LoginForm from '../../components/forms/LoginForm';
import HumanCheckModal from '../../components/modal/HumanCheckModal';

import { useUser } from '../../contexts/UserContext';
import { registerFcmToken } from '../../services/fcm';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showHumanCheck, setShowHumanCheck] = useState(false);
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  const navigation = useNavigation<any>();
  const { setUser } = useUser();

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (!username || !password) {
      setError('Username dan password wajib diisi');
      return;
    }

    setError('');

    if (!isHumanVerified) {
      setShowHumanCheck(true);
      return;
    }

    login();
  };

  /* ================= LOGIN ================= */

  const login = async () => {
    setLoading(true);
    try {
      const res = await API.post('/login', {
        username,
        password,
        human_verified: true,
      });

      const { token, user } = res.data;

      await AsyncStorage.setItem('token', token);
      API.defaults.headers.common.Authorization = `Bearer ${token}`;

      await setUser(user);

      // 🔥 INI WAJIB
      await registerFcmToken();

      navigation.replace('Main');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  /* ================= LUPA PASSWORD ================= */

  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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
        onForgotPassword={goToForgotPassword}
      />

      <HumanCheckModal
        visible={showHumanCheck}
        onSuccess={() => {
          setIsHumanVerified(true);
          setShowHumanCheck(false);
          login();
        }}
      />
    </>
  );
};

export default LoginScreen;
