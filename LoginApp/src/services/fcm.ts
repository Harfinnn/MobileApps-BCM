import messaging from '@react-native-firebase/messaging';
import API from './api';

export async function registerFcmToken() {
  try {

    const token = await messaging().getToken();

    if (!token) {
      console.log('❌ Gagal mendapatkan FCM Token');
      return;
    }

    console.log('🔥 FCM TOKEN (Login) =>', token);

    // 2. Kirim ke backend API
    await API.post('/update-fcm-token', {
      fcm_token: token,
    });

    console.log('✅ Token berhasil dikirim ke server');
  } catch (e) {
    console.error('❌ FCM ERROR:', e);
  }
}
