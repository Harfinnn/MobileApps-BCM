import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { navigate } from '../navigation/navigationRef';

let isRegistered = false;

// 🔥 CALLBACK UNTUK REFRESH HEADER
let onNotificationReceived: (() => void) | null = null;

export function setNotificationListener(callback: () => void) {
  onNotificationReceived = callback;
}

function handleNotificationNavigation(data?: any) {
  if (!data?.type) return;

  switch (data.type) {
    case 'bencana':
      if (data.lapor_id) {
        navigate('DetailBencana', {
          id: Number(data.lapor_id),
        });
      }
      break;

    case 'announcement':
      navigate('DashboardBencana');
      break;

    default:
      console.log('Unknown notification type:', data.type);
  }
}

export function registerFcmHandlers() {
  if (isRegistered) return;
  isRegistered = true;

  // 🔔 FOREGROUND MESSAGE
  messaging().onMessage(async msg => {
    await notifee.displayNotification({
      title: String(msg.data?.title ?? 'Notifikasi'),
      body: String(msg.data?.body ?? ''),
      data: msg.data,
      android: {
        channelId: 'default',
        pressAction: { id: 'default' },
      },
    });

    // 🔥 REFRESH HEADER REALTIME
    if (onNotificationReceived) {
      onNotificationReceived();
    }
  });

  // 🔔 CLICK FOREGROUND
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      handleNotificationNavigation(detail.notification?.data);
    }
  });
}
