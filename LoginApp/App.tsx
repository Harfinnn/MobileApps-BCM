import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { AppState } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { LayoutProvider } from './src/contexts/LayoutContext';
import { UserProvider } from './src/contexts/UserContext';

import {
  navigationRef,
  flushPendingNavigation,
  markOpenedFromNotification,
} from './src/navigation/navigationRef';

import { registerFcmHandlers } from './src/services/fcmHandler';

const App = () => {
  // 1️⃣ SETUP NOTIFICATION (ONCE)
  useEffect(() => {
    notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH,
      badge: true,
    });

    notifee.requestPermission();
    registerFcmHandlers();
  }, []);

  // 2️⃣ HANDLE COLD START (KILL STATE)
  useEffect(() => {
    async function handleInitialNotification() {
      const initial = await notifee.getInitialNotification();
      if (!initial) return;

      const data = initial.notification?.data;

      if (data?.type) {
        markOpenedFromNotification(data);
      }
    }

    handleInitialNotification();
  }, []);

  // 3️⃣ HANDLE RESUME FROM BACKGROUND
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        flushPendingNavigation();
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <UserProvider>
          <LayoutProvider>
            <NavigationContainer
              ref={navigationRef}
              onReady={flushPendingNavigation}
            >
              <AppNavigator />
            </NavigationContainer>
            <Toast />
          </LayoutProvider>
        </UserProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
