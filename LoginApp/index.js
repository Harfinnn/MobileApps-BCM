import 'react-native-url-polyfill/auto';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';
import { markOpenedFromNotification } from './src/navigation/navigationRef';
import AsyncStorage from '@react-native-async-storage/async-storage';


// convert semua data jadi string
function normalizeData(data) {
  if (!data) return undefined;

  const result = {};

  Object.keys(data).forEach(key => {
    const value = data[key];
    result[key] =
      typeof value === 'string' ? value : JSON.stringify(value);
  });

  return result;
}

// BACKGROUND / KILLED
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const data = remoteMessage.data;

  if (!data) return;

  // ✅ SIMPAN HANYA GEMPA + USER BIASA
  if (data.type === 'gempa' && data.user_jabatan !== '1') {
    await AsyncStorage.setItem(
      'LAST_GEMPA_USER',
      JSON.stringify(data),
    );

    await AsyncStorage.setItem('GEMPA_REPORT_STATUS', 'pending');
  }

  await notifee.displayNotification({
        title: String(data.title || 'Notifikasi'),
        body: String(data.body || ''),
        data: normalizeData(data),
        android: {
          channelId: 'sound_bencana_v1', 
          pressAction: {
            id: 'default',
          },
          sound: 'notif_bencana', 
        },
      });
});

// HANDLE CLICK
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    const data = detail.notification?.data;
    if (data) {
      markOpenedFromNotification(data);
    }
  }
});

AppRegistry.registerComponent(appName, () => App);