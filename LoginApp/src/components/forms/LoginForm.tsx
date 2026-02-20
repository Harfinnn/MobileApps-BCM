import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import styles from '../../styles/auth/loginStyles';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  username: string;
  password: string;
  error: string;
  loading: boolean;
  onChangeUsername: (v: string) => void;
  onChangePassword: (v: string) => void;
  onSubmit: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<Props> = ({
  username,
  password,
  error,
  loading,
  onChangeUsername,
  onChangePassword,
  onSubmit,
  onForgotPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (error) {
      triggerShake();
    }
  }, [error]);

  useEffect(() => {
    if (!loading && !error && password && username) {
      triggerSuccess();
    }
  }, [loading]);

  const triggerShake = () => {
    shakeAnim.setValue(0);

    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTogglePassword = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setShowPassword(prev => !prev);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const triggerSuccess = () => {
    Animated.sequence([
      Animated.spring(successScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(successScale, {
        toValue: 1.05,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(successScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Image
            source={require('../../assets/newlogo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Animated.View
          style={[styles.formCard, { transform: [{ translateX: shakeAnim }] }]}
        >
          <Text style={styles.formTitle}>Login</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor="#CBD5E1"
              value={username}
              onChangeText={onChangeUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>

            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Masukkan password"
                placeholderTextColor="#CBD5E1"
                value={password}
                onChangeText={onChangePassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={handleTogglePassword}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  }}
                >
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#00A39D"
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>

          {/* 🔑 LUPA PASSWORD */}
          <TouchableOpacity
            onPress={onForgotPassword}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Lupa password?</Text>
          </TouchableOpacity>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#00A39D" />
            </View>
          ) : (
            <Animated.View style={{ transform: [{ scale: successScale }] }}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={onSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Masuk Sekarang</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        <Text style={styles.footerVersion}>v1.0.0 Build 2026</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;
