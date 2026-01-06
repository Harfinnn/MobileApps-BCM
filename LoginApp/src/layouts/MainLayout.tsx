import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useLayout } from '../contexts/LayoutContext';
import { useNavigation } from '@react-navigation/native';

import DashboardHeader from '../components/common/DashboardHeader';
import NavigationBar from '../components/common/NavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = useNavigation<any>();
  const { title, hideNavbar } = useLayout();

  const handleLogout = async () => {
    // 1. Hapus auth data
    await AsyncStorage.multiRemove(['token', 'user']);

    // 2. Reset navigation (ANTI BACK)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <DashboardHeader
            title={title}
            onProfilePress={() =>
              navigation.navigate('Main', {
                screen: 'Profile',
              })
            }
            onLogoutPress={handleLogout}
          />

          <View style={{ flex: 1 }}>{children}</View>

          {!hideNavbar && <NavigationBar />}
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
