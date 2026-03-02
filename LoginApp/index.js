import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';
import { markOpenedFromNotification } from './src/navigation/navigationRef';

// 🔔 BACKGROUND & KILL STATE MESSAGE
messaging().setBackgroundMessageHandler(async remoteMessage => {
  await notifee.displayNotification({
    title: remoteMessage.data?.title ?? 'Notifikasi',
    body: remoteMessage.data?.body ?? '',
    data: remoteMessage.data,
    android: {
      channelId: 'custom-sound-v2',
      pressAction: { id: 'default' },
    }
  });
});

// 🔔 HANDLE CLICK SAAT BACKGROUND / KILL
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    markOpenedFromNotification(detail.notification?.data);
  }
});

AppRegistry.registerComponent(appName, () => App);