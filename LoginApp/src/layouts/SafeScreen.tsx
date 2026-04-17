import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
};

export default function SafeScreen({ children, scroll = false }: Props) {
  const insets = useSafeAreaInsets();

  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom + 24, 
      }}
    >
      {children}
    </View>
  );
}