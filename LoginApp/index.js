import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';
import { markOpenedFromNotification } from './src/navigation/navigationRef';

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
  const title =
    (remoteMessage.data && remoteMessage.data.title) ||
    (remoteMessage.notification && remoteMessage.notification.title) ||
    'Notifikasi';

  const body =
    (remoteMessage.data && remoteMessage.data.body) ||
    (remoteMessage.notification && remoteMessage.notification.body) ||
    '';

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