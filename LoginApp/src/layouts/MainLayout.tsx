import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
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

  const { title, hideNavbar, setHideNavbar, headerBg} = useLayout();

  const dashboardSheetRef = useRef<BottomSheetModal>(null);

  const closeDashboard = () => {
    setHideNavbar(false);
    dashboardSheetRef.current?.dismiss();
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardHeader
        title={title}
        backgroundColor={headerBg}
        onProfilePress={() =>
          navigation.navigate('Main', { screen: 'Profile' })
        }
        onLogoutPress={async () => {
          await AsyncStorage.multiRemove(['token', 'user']);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }}
      />

      <View style={{ flex: 1 }}>{children}</View>

      {hideNavbar ? null : <NavigationBar />}

      {/* 🔥 DASHBOARD POPUP */}
      <BottomSheetModal
        ref={dashboardSheetRef}
        snapPoints={['40%']}
        enablePanDownToClose
        onDismiss={closeDashboard}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={{ marginBottom: 16 }}
            onPress={() => {
              closeDashboard();
              navigation.navigate('DashboardIT');
            }}
          >
            <Text>Dashboard IT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              closeDashboard();
              navigation.navigate('DashboardNonIT');
            }}
          >
            <Text>Dashboard Non-IT</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </View>
  );
}
