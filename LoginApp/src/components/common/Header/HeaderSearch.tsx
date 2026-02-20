import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { XCircle } from 'lucide-react-native';
import { styles } from '../../../styles/navigation/headerStyle';

export function HeaderSearch({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <View style={styles.searchPill}>
      <TextInput
        value={value}
        onChangeText={onChange}
        autoFocus
        placeholder="Search..."
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
      />
      <TouchableOpacity onPress={onClose}>
        <XCircle size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}
