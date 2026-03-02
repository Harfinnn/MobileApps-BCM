// ================================
// WEATHER CACHE (CURRENT + FORECAST)
// ================================

import { BASE_URL } from '../config/env';

let WEATHER_CACHE: Record<string, any> = {};

export const fetchWeatherAPI = async (
  lat: number,
  lon: number,
  adm4: string,
) => {
  const roundedLat = Number(lat.toFixed(2));
  const roundedLon = Number(lon.toFixed(2));

  const cacheKey = `${roundedLat}_${roundedLon}_${adm4}`;

  if (WEATHER_CACHE[cacheKey]) {
    console.log('⚡ WEATHER FROM CACHE');
    return WEATHER_CACHE[cacheKey];
  }

  console.log('🌐 FETCH WEATHER FROM API');

  const res = await fetch(
    `${BASE_URL}/api/weather?lat=${roundedLat}&lon=${roundedLon}&adm4=${adm4}`,
  );

  console.log('STATUS:', res.status);

  const text = await res.text();
  console.log('RESPONSE RAW:', text);

  if (!res.ok) {
    throw new Error('Weather API error');
  }

  const json = JSON.parse(text);

  WEATHER_CACHE[cacheKey] = json.data;

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
