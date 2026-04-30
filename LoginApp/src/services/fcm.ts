import {
  getMessaging,
  registerDeviceForRemoteMessages,
  getToken,
  subscribeToTopic,
  unsubscribeFromTopic,
} from '@react-native-firebase/messaging';
import API from './api';
import { Platform, PermissionsAndroid } from 'react-native';
import { User } from '../contexts/UserContext';

async function requestPermission() {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version < 33) return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function registerFcmToken(user: User | null) {
  try {
    const allowed = await requestPermission();
    if (!allowed) return;

    const messaging = getMessaging();

    await registerDeviceForRemoteMessages(messaging);

    const token = await getToken(messaging);
    if (!token) return;

    console.log('🔥 FCM TOKEN =>', token);

    await API.post('/save-fcm-token', {
      fcm_token: token,
    });

    if (user?.user_jabatan == 1) {
      await subscribeToTopic(messaging, 'gempa_superadmin');
      console.log('✅ SUBSCRIBE TOPIC gempa_superadmin');
    }
  } catch (e) {
    console.log('FCM ERROR', e);
  }
}
