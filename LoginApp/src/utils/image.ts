import { BASE_URL } from '../config/env';

export const resolveImageUri = (path?: string | null) => {
  if (!path) return null;

  // kalau backend sudah kirim full URL
  if (path.startsWith('http')) return path;

  // path dari DB: profile/xxx.jpg
  return `${BASE_URL}/storage/${path}`;
};
