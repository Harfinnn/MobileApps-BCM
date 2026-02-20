import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import styles from '../../styles/auth/registerStyles';

const RegisterForm = ({
  nama,
  username,
  hp,
  password,
  error,
  loading,
  onChangeNama,
  onChangeUsername,
  onChangeHp,
  onChangePassword,
  onSubmit,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        {/* Nama */}
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama lengkap"
          placeholderTextColor="#94A3B8"
          value={nama}
          onChangeText={onChangeNama}
        />

        {/* Username */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan email"
          placeholderTextColor="#94A3B8"
          value={username}
          onChangeText={onChangeUsername}
          autoCapitalize="none"
        />

        {/* No HP */}
        <Text style={styles.label}>No Handphone</Text>
        <TextInput
          style={styles.input}
          placeholder="08xxxxxxxxxx"
          placeholderTextColor="#94A3B8"
          value={hp}
          onChangeText={onChangeHp}
          keyboardType="phone-pad"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={onChangePassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default RegisterForm;
