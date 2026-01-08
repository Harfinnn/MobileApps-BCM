import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import styles from '../../styles/loginStyles'

interface Props {
  username: string;
  password: string;
  error: string;
  loading: boolean;
  onChangeUsername: (v: string) => void;
  onChangePassword: (v: string) => void;
  onSubmit: () => void;
  onGoRegister: () => void;
}

const LoginForm: React.FC<Props> = ({
  username,
  password,
  error,
  loading,
  onChangeUsername,
  onChangePassword,
  onSubmit,
  onGoRegister,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/newlogo.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#94A3B8"
          value={username}
          onChangeText={onChangeUsername}
          autoCapitalize="none"
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={onChangePassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.registerText}>
          Belum punya akun?{' '}
          <Text style={styles.registerLink} onPress={onGoRegister}>
            Daftar
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginForm;
