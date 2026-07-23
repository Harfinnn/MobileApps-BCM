import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';
import { triggerLogout } from './authHandler';

const API = axios.create({
  baseURL: `${ENV.BASE_URL}/api`,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36',
  },
});

API.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

// 🔥 AUTO LOGOUT JIKA TOKEN INVALID / USER DISABLE
API.interceptors.response.use(
  response => response,
  async error => {
    const status = error?.response?.status;
    const url = error?.config?.url;

    if ((status === 401 || status === 403) && url !== '/me') {
      console.log('Session expired or user disabled');

      await triggerLogout();
    }

    return Promise.reject(error);
  },
);

export function setAuthToken(token: string | null) {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
}

export default API;
