import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

interface Props {
  visible: boolean;
  onSuccess: () => void;
}

const HumanCheckModal: React.FC<Props> = ({ visible, onSuccess }) => {
  const [checked, setChecked] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  // reset state tiap modal dibuka
  useEffect(() => {
    if (visible) {
      setChecked(false);
      setCanContinue(false);
    }
  }, [visible]);

  // delay anti-bot (UX)
  useEffect(() => {
    if (!checked) return;

    const timer = setTimeout(() => {
      setCanContinue(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [checked]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      >
        <View
          style={{
            margin: 20,
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Verifikasi Manusia
          </Text>

          <Pressable
            onPress={() => setChecked(!checked)}
            style={{ marginTop: 15 }}
          >
            <Text>{checked ? '☑️' : '⬜'} Saya bukan robot</Text>
          </Pressable>

          <Pressable
            disabled={!canContinue}
            onPress={() => {
              if (!canContinue) return;
              onSuccess();
            }}
            style={{
              marginTop: 20,
              padding: 12,
              borderRadius: 6,
              backgroundColor: canContinue ? '#4CAF50' : '#ccc',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff' }}>Lanjut Login</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default HumanCheckModal;
