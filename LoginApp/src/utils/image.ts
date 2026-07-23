import { ENV } from '../config/env';

export const resolveImageUri = (path?: string | null) => {
  if (!path) return null;

  // Jika backend sudah mengirim URL lengkap
  if (path.startsWith('http')) {
    return path;
  }

  // Path relatif dari storage Laravel
  return `${ENV.BASE_URL}/storage/${path}`;
};
