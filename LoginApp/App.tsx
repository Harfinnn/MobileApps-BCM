import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { AppState } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppConfigProvider } from './src/contexts/AppConfigContext';
import AppNavigator from './src/navigation/AppNavigator';
import { LayoutProvider } from './src/contexts/LayoutContext';
import { UserProvider } from './src/contexts/UserContext';

import {
  navigationRef,
  flushPendingNavigation,
  markOpenedFromNotification,
} from './src/navigation/navigationRef';
import { LocationProvider } from './src/contexts/LocationContext';

// 🔧 Convert firebase data supaya semua string
function normalizeData(
  data?: Record<string, any>,
): Record<string, string> | undefined {
  if (!data) return undefined;

  const result: Record<string, string> = {};

  Object.keys(data).forEach(key => {
    const value = data[key];
    result[key] = typeof value === 'string' ? value : JSON.stringify(value);
  });

  return result;
}

const App = () => {
  // 🔔 SETUP PERMISSION, CHANNEL, & TOKEN (DIGABUNG AGAR TIDAK HANG)
  useEffect(() => {
    async function setupNotification() {
      try {
        // 1. Minta Izin Terlebih Dahulu
        await messaging().requestPermission();
        await notifee.requestPermission();

        // 2. Buat Channel (Bypass Cache Android)
        await notifee.createChannel({
          id: 'sound_bencana_v1',
          name: 'General Notification',
          importance: AndroidImportance.HIGH,
          badge: true,
          sound: 'notif_bencana',
        });

        // 3. Ambil Token FCM (Hanya setelah izin beres)
        const token = await messaging().getToken();
        console.log('🔥 FCM TOKEN BERHASIL:', token);
      } catch (error) {
        console.error('❌ Gagal setup notifikasi:', error);
      }
    }

    setupNotification();
  }, []);

  // 🔔 HANDLE CLICK (FOREGROUND)
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const data = detail.notification?.data;

        if (data) {
          markOpenedFromNotification(data);
          flushPendingNavigation();
        }
      }
    });
  }, []);

  // 🔔 HANDLE CLICK (APP MATI)
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data) {
          markOpenedFromNotification(remoteMessage.data);
        }
      });
  }, []);

  // 🔔 HANDLE NAVIGATION DELAY
  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state === 'active') {
        flushPendingNavigation();
        await notifee.cancelAllNotifications();
      }
    });

    return () => sub.remove();
  }, []);

  // KILLED APP
  useEffect(() => {
    const checkInitialNotif = async () => {
      const initialNotif = await messaging().getInitialNotification();

      if (
        initialNotif?.data?.type === 'gempa' &&
        initialNotif?.data?.user_jabatan !== '1'
      ) {
        await AsyncStorage.setItem(
          'LAST_GEMPA_USER',
          JSON.stringify(initialNotif.data),
        );

        await AsyncStorage.setItem('GEMPA_REPORT_STATUS', 'pending');
      }
    };

    checkInitialNotif();
  }, []);

  // BACKGROUND
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        if (
          remoteMessage?.data?.type === 'gempa' &&
          remoteMessage?.data?.user_jabatan !== '1'
        ) {
          await AsyncStorage.setItem(
            'LAST_GEMPA_USER',
            JSON.stringify(remoteMessage.data),
          );

          await AsyncStorage.setItem('GEMPA_REPORT_STATUS', 'pending');
        }

        if (remoteMessage?.data) {
          markOpenedFromNotification(remoteMessage.data);
        }
      },
    );

    return unsubscribe;
  }, []);

  // FOREGROUND PUSH NOTIFICATION
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const data = remoteMessage.data;

      if (!data) return;

      // ✅ SIMPAN HANYA GEMPA + USER BIASA
      if (data.type === 'gempa' && data.user_jabatan !== '1') {
        await AsyncStorage.setItem('LAST_GEMPA_USER', JSON.stringify(data));
        await AsyncStorage.setItem('GEMPA_REPORT_STATUS', 'pending');
      }

      await notifee.displayNotification({
        title: String(data.title),
        body: String(data.body),
        data: normalizeData(data), // Tambahkan data payload ke notifee lokal
        android: {
          channelId: 'sound_bencana_v1', // 👈 PASTIKAN INI SAMA DENGAN ID BARU
          pressAction: {
            id: 'default',
          },
          sound: 'notif_bencana',
        },
      });
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <AppConfigProvider>
          <UserProvider>
            <LayoutProvider>
              <LocationProvider>
                <NavigationContainer
                  ref={navigationRef}
                  onReady={flushPendingNavigation}
                >
                  <AppNavigator />
                </NavigationContainer>
              </LocationProvider>
              <Toast />
            </LayoutProvider>
          </UserProvider>
        </AppConfigProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
