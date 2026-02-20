import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API from '../../services/api';
import { useLayout } from '../../contexts/LayoutContext';
import styles from '../../styles/auth/forgotPasswordStyle';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setOnBack } = useLayout();

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ================= LAYOUT ================= */

  useEffect(() => {
    setTitle('Lupa Password');
    setHideNavbar(true);
    setShowBack(true);

    setOnBack(() => () => {
      navigation.goBack();
      return true;
    });

    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [navigation, setTitle, setHideNavbar, setShowBack, setOnBack]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError('Username wajib diisi');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await API.post('/forgot-password', { username });

      Alert.alert(
        'Berhasil',
        'Instruksi reset password telah dikirim. Silakan cek admin atau email terkait.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Gagal memproses permintaan lupa password',
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDFA" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Text style={styles.title}>Lupa Password</Text>
          <Text style={styles.subtitle}>
            Masukkan username Anda untuk reset password
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor="#CBD5E1"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {loading ? (
            <ActivityIndicator size="large" color="#00A39D" />
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                Kirim Permintaan
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
