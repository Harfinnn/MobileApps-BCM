import axios from 'axios';
import { BASE_URL } from '../config/env';

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
});

/**
 * 🔐 SET / CLEAR AUTH TOKEN
 * WAJIB dipanggil saat app start & login
 */
export function setAuthToken(token: string | null) {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
}

export default API;
