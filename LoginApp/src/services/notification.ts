import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

export async function setupNotificationChannel() {
  if (Platform.OS !== 'android') return;

  await notifee.createChannel({
    id: 'default',
    name: 'Default Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
}
