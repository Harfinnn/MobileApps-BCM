import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { markOpenedFromNotification } from './src/navigation/navigationRef';

// 🔔 DISPLAY NOTIF (BACKGROUND / KILL)
messaging().setBackgroundMessageHandler(async msg => {
  await notifee.displayNotification({
    title: String(msg.data?.title ?? 'Notifikasi'),
    body: String(msg.data?.body ?? ''),
    data: msg.data,
    android: {
      channelId: 'default',
      pressAction: { id: 'default' },
    },
  });
});

// 🔔 SIMPAN INTENT SAAT KLIK (JANGAN NAVIGATE)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    markOpenedFromNotification(detail.notification?.data);
  }
});

AppRegistry.registerComponent(appName, () => App);
