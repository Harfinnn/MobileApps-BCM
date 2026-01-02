import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles/registerStyles';

interface Props {
  nama: string;
  username: string;
  hp: string;
  password: string;
  error: string;
  loading: boolean;
  onChangeNama: (v: string) => void;
  onChangeUsername: (v: string) => void;
  onChangeHp: (v: string) => void;
  onChangePassword: (v: string) => void;
  onSubmit: () => void;
}

const RegisterForm: React.FC<Props> = ({
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
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          value={nama}
          onChangeText={onChangeNama}
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={onChangeUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="No HP"
          value={hp}
          onChangeText={onChangeHp}
          keyboardType="phone-pad"
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={onChangePassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggle}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
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
