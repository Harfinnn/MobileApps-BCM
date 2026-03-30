import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import API from './api';

async function requestPermission() {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version < 33) return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function registerFcmToken() {
  try {
    const allowed = await requestPermission();
    if (!allowed) return;

    await messaging().registerDeviceForRemoteMessages();

    // 🔥 HAPUS TOKEN LAMA
    await messaging().deleteToken();

    const token = await messaging().getToken();
    if (!token) return;

    console.log('🔥 FCM TOKEN BARU =>', token);

    await API.post('/update-fcm-token', {
      fcm_token: token,
    });
  } catch (e) {
    console.log('FCM ERROR', e);
  }
}
