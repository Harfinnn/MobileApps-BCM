import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { AppState } from 'react-native';
import messaging from '@react-native-firebase/messaging';

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

  // 🔔 HANDLE CLICK (BACKGROUND)
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.data) {
        markOpenedFromNotification(remoteMessage.data);
      }
    });

    return unsubscribe;
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

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('NOTIF DITEKAN:', remoteMessage?.data);

    if (remoteMessage?.data) {
      markOpenedFromNotification(remoteMessage.data);
    }
  });

  // 🔔 HANDLE NAVIGATION DELAY
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        flushPendingNavigation();
      }
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('MESSAGE RECEIVED', remoteMessage);
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
