import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';

import API from '../../services/api';

const ChangePasswordFirstScreen = ({ route, navigation }: any) => {
  const { user_id, fromProfile } = route.params;

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const submit = async () => {
    if (password !== passwordConfirmation) {
      Alert.alert('Error', 'Konfirmasi password tidak sama');
      return;
    }

    try {
      await API.post('/first-change-password', {
        user_id,
        old_password: oldPassword,
        password,
        password_confirmation: passwordConfirmation,
      });

      Alert.alert('Berhasil', 'Password berhasil diganti');

      if (fromProfile) {
        navigation.goBack(); // kembali ke profile
      } else {
        navigation.replace('Login'); // login ulang
      }
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Gagal mengganti password',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Text style={styles.title}>Update Keamanan</Text>
            <Text style={styles.subtitle}>
              Langkah terakhir untuk mengamankan akun Anda.
            </Text>
          </View>

          {/* Bagian Card */}
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password Lama</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Masukkan password saat ini"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password Baru</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholder="Minimal 8 karakter"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Konfirmasi Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                placeholder="Ulangi password baru"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={submit}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Simpan Password</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Batal</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    // Shadow untuk iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    // Elevation untuk Android
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonPrimary: {
    backgroundColor: '#00A39D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 25,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ChangePasswordFirstScreen;
