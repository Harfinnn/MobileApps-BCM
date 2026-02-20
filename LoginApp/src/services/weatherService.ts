// ================================
// FORECAST CACHE
// ================================

import { BASE_URL } from '../config/env';

let FORECAST_CACHE: Record<string, any> = {};

export const fetchForecastAPI = async (adm4: string) => {
  // ✅ 1. Kalau sudah ada di cache → langsung return
  if (FORECAST_CACHE[adm4]) {
    console.log('⚡ FORECAST FROM CACHE');
    return FORECAST_CACHE[adm4];
  }

  console.log('🌐 FETCH FORECAST FROM API');

  const res = await fetch(`${BASE_URL}/api/weather?adm4=${adm4}`);

  if (!res.ok) {
    throw new Error('Weather API error');
  }

  const json = await res.json();

  // ✅ 2. Simpan ke cache
  FORECAST_CACHE[adm4] = json.data;

  return json.data;
};

// ================================
// CAP CACHE
// ================================

let CAP_CACHE: any = null;
let CAP_TIMESTAMP = 0;

export const fetchCAPAPI = async () => {
  const now = Date.now();

  if (CAP_CACHE && now - CAP_TIMESTAMP < 10 * 60 * 1000) {
    return CAP_CACHE;
  }

  try {
    const res = await fetch('https://www.bmkg.go.id/alerts/nowcast/id');

    if (!res.ok) return null;

    const xml = await res.text();

    const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/);
    if (!itemMatch) return null;

    const item = itemMatch[1];
    const title = item.match(/<title>(.*?)<\/title>/);
    const description = item.match(/<description>(.*?)<\/description>/);
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/);

    if (title && description) {
      CAP_CACHE = {
        type: 'alert',
        title: title[1],
        description: description[1],
        expires: pubDate ? new Date(pubDate[1]) : null,
      };

      CAP_TIMESTAMP = now;

      return CAP_CACHE;
    }

    return null;
  } catch {
    return null;
  }
};

// ================================
// NEAREST ADM4 FROM BACKEND
// ================================

export const fetchNearestADM4 = async (lat: number, lon: number) => {
  try {
    const url = `${BASE_URL}/api/adm4/nearest?lat=${lat}&lon=${lon}`;

    const res = await fetch(url);

    const text = await res.text();

    if (!res.ok) throw new Error('Server error');

    return JSON.parse(text);
  } catch (error) {
    console.log('FETCH ERROR DETAIL:', error);
    throw error;
  }
};
