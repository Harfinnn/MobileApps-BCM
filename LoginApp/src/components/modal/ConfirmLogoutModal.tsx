import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LogOut } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmLogoutModal({
  visible,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          
          <View style={styles.iconWrapper}>
            <LogOut size={28} color="#EF4444" />
          </View>

          <Text style={styles.title}>Keluar Akun</Text>

          <Text style={styles.message}>
            Apakah Anda yakin ingin keluar dari akun ini?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={onConfirm}>
              <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },

  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },

  cancelText: {
    color: '#374151',
    fontWeight: '600',
  },

  logoutBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },

  logoutText: {
    color: '#FFF',
    fontWeight: '700',
  },
});