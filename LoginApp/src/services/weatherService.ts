import { BASE_URL } from '../config/env';

/* ================================
   CONFIG
================================ */

const OWM_API_KEY = '0c37c0573bcf4c2cdcf8e3904e189c15';
const CACHE_TTL = 10 * 60 * 1000; // 10 menit

/* ================================
   WEATHER CACHE
================================ */

let WEATHER_CACHE: Record<string, { data: any; timestamp: number }> = {};

/* ================================
   FETCH WEATHER (OWM)
================================ */

export const fetchWeatherAPI = async (lat: number, lon: number) => {
  const roundedLat = Number(lat.toFixed(2));
  const roundedLon = Number(lon.toFixed(2));

  const cacheKey = `${roundedLat}_${roundedLon}`;
  const now = Date.now();

  const cached = WEATHER_CACHE[cacheKey];

  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log('⚡ WEATHER FROM CACHE');
    return cached.data;
  }

  console.log('🌐 FETCH WEATHER FROM OPENWEATHER');

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${roundedLat}&lon=${roundedLon}&appid=${OWM_API_KEY}&units=metric&lang=id`,
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${roundedLat}&lon=${roundedLon}&appid=${OWM_API_KEY}&units=metric&lang=id`,
      ),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error('OpenWeather API error');
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    const combinedData = {
      current: currentData,
      forecast: forecastData,
    };

    WEATHER_CACHE[cacheKey] = {
      data: combinedData,
      timestamp: now,
    };

    return combinedData;
  } catch (error) {
    console.log('❌ WEATHER ERROR:', error);
    throw error;
  }
};

/* ================================
   CAP CACHE (BMKG)
================================ */

let CAP_CACHE: any = null;
let CAP_TIMESTAMP = 0;

export const fetchCAPAPI = async () => {
  const now = Date.now();

  if (CAP_CACHE && now - CAP_TIMESTAMP < CACHE_TTL) {
    return CAP_CACHE;
  }

  try {
    const res = await fetch('https://www.bmkg.go.id/alerts/nowcast/id/rss.xml');

    if (!res.ok) return null;

    const xml = await res.text();

    const items = xml.split('<item>').slice(1);
    if (!items.length) return null;

    const alerts = items
      .map(item => {
        const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
        const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);

        if (!titleMatch || !descMatch) return null;

        return {
          title: titleMatch[1].trim(),
          description: descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
        };
      })
      .filter(Boolean);

    if (!alerts.length) return null;

    const result = {
      ...alerts[0],
      isLocal: false,
    };

    CAP_CACHE = result;
    CAP_TIMESTAMP = now;

    console.log('🌍 BMKG ALERT:', result);

    return result;
  } catch (err) {
    console.log('❌ CAP ERROR:', err);
    return null;
  }
};
