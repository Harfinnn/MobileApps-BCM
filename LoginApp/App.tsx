import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { AppState } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppConfigProvider } from './src/contexts/AppConfigContext';
import AppNavigator from './src/navigation/AppNavigator';
import { LayoutProvider } from './src/contexts/LayoutContext';
import { UserProvider } from './src/contexts/UserContext';
import { getMessaging, onTokenRefresh } from '@react-native-firebase/messaging';

import {
  navigationRef,
  flushPendingNavigation,
  markOpenedFromNotification,
} from './src/navigation/navigationRef';
import { LocationProvider } from './src/contexts/LocationContext';
import API from './src/services/api';

// 🔧 Convert firebase data supaya semua string
function normalizeData(data?: any): Record<string, string> | undefined {
  if (!data) return undefined;

  const result: Record<string, string> = {};

  Object.keys(data).forEach(key => {
    const value = data[key];
    result[key] = typeof value === 'string' ? value : JSON.stringify(value);
  });

  return result;
}

const App = () => {
  // 🔥 GET FCM TOKEN
  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        console.log('🔥 FCM TOKEN:', token);
      });
  }, []);

  // 🔔 SETUP PERMISSION + CHANNEL
  useEffect(() => {
    async function setupNotification() {
      await messaging().requestPermission();
      await notifee.requestPermission();

      await notifee.createChannel({
        id: 'custom-sound-v2',
        name: 'General Notification',
        importance: AndroidImportance.HIGH,
        badge: true,
        sound: 'notif_bencana', // tanpa .mp3
      });
    }

    setupNotification();
  }, []);

  // 🔔 FOREGROUND MESSAGE
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('MESSAGE RECEIVED', remoteMessage);

      const title = String(
        remoteMessage.data?.title ??
          remoteMessage.notification?.title ??
          'Notifikasi',
      );

      const body = String(
        remoteMessage.data?.body ?? remoteMessage.notification?.body ?? '',
      );

      await notifee.displayNotification({
        title,
        body,
        data: normalizeData(remoteMessage.data),
        android: {
          channelId: 'custom-sound-v2',
          sound: 'notif_bencana',
          pressAction: {
            id: 'default',
          },
        },
      });
    });

    return unsubscribe;
  }, []);

  // 🔔 HANDLE APP OPEN FROM NOTIFICATION
  useEffect(() => {
    async function handleInitialNotification() {
      const initial = await notifee.getInitialNotification();
      if (!initial) return;

      const data = initial.notification?.data;

      if (data) {
        markOpenedFromNotification(data);
      }
    }

    handleInitialNotification();
  }, []);

  // 🔔 HANDLE NAVIGATION DELAY
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        flushPendingNavigation();
      }
    });

    return () => sub.remove();
  }, []);

  //Listener Token
  useEffect(() => {
    const messaging = getMessaging();

    const unsubscribe = onTokenRefresh(messaging, async token => {
      console.log('🔄 TOKEN REFRESH:', token);

      try {
        await API.post('/save-fcm-token', {
          fcm_token: token,
        });
      } catch (e) {
        console.log('Failed update token', e);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
};

export default App;
