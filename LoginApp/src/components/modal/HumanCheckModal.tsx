import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';

interface Props {
  visible: boolean;
  onSuccess: () => void;
}

const HumanCheckModal: React.FC<Props> = ({ visible, onSuccess }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [checked, setChecked] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setChecked(false);
      setCanContinue(false);
      setIsVerifying(false);
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const handleCheck = () => {
    if (checked) return;

    setChecked(true);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setCanContinue(true);

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }).start();
    }, 1800);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Verifikasi Keamanan</Text>
            <Text style={styles.subtitle}>
              Pastikan Anda bukan program otomatis
            </Text>
          </View>

          <Pressable
            onPress={handleCheck}
            style={[styles.captchaBox, checked && styles.captchaBoxChecked]}
          >
            <View style={styles.row}>
              <View style={styles.checkbox}>
                {isVerifying ? (
                  <ActivityIndicator size="small" color="#00A39D" />
                ) : checked ? (
                  <Animated.Text
                    style={[
                      styles.checkIcon,
                      { transform: [{ scale: scaleAnim }] },
                    ]}
                  >
                    ✓
                  </Animated.Text>
                ) : null}
              </View>

              <Text style={styles.captchaText}>
                {checked && isVerifying
                  ? 'Memverifikasi...'
                  : 'Saya bukan robot'}
              </Text>
            </View>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>reCAPTCHA</Text>
              <Text style={styles.privacyText}>Privacy - Terms</Text>
            </View>
          </Pressable>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!canContinue}
            onPress={onSuccess}
            style={[styles.submitBtn, !canContinue && styles.submitBtnDisabled]}
          >
            <Text style={styles.submitBtnText}>Verifikasi & Lanjutkan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Karena Anda ingin dipisah, pindahkan ini ke file style atau taruh di bawah
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)', // Overlay lebih gelap & elegan
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  captchaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
  },
  captchaBoxChecked: {
    borderColor: '#00A39D',
    backgroundColor: '#F0FDFA',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkIcon: {
    fontSize: 16,
    color: '#00A39D',
    fontWeight: 'bold',
  },
  captchaText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  privacyText: {
    fontSize: 8,
    color: '#94A3B8',
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#00A39D',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#00A39D',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

import { TouchableOpacity } from 'react-native';

export default HumanCheckModal;
