import { BASE_URL } from '../config/env';

// PENTING: Masukkan API Key OWM milikmu di sini atau di file env
const OWM_API_KEY = '0c37c0573bcf4c2cdcf8e3904e189c15';

// ================================
// WEATHER CACHE (CURRENT + FORECAST)
// ================================

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

  console.log('🌐 FETCH WEATHER FROM OPENWEATHERMAP');

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
      throw new Error('OpenWeatherMap API error');
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    const combinedData = {
      current: currentData,
      forecast: forecastData,
    };

    WEATHER_CACHE[cacheKey] = combinedData;

    return combinedData;
  } catch (error) {
    console.log('❌ OWM FETCH ERROR:', error);
    throw error;
  }
};

// ================================
// CAP CACHE (BMKG - TIDAK DIUBAH)
// ================================

let CAP_CACHE: any = null;
let CAP_TIMESTAMP = 0;

export const fetchCAPAPI = async (locationName?: string) => {
  const now = Date.now();

  if (CAP_CACHE && now - CAP_TIMESTAMP < 10 * 60 * 1000) {
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
      .filter((a): a is { title: string; description: string } => a !== null);

    if (!alerts.length) return null;

    let matched = null;

    if (locationName) {
      const parts = locationName.toLowerCase().split(',');
      const keywords = parts.map(p => p.trim());

      matched = alerts.find(a =>
        keywords.some(
          k =>
            a.title.toLowerCase().includes(k) ||
            a.description.toLowerCase().includes(k),
        ),
      );
    }

    let result;

    if (matched) {
      result = { ...matched, isLocal: true };
    } else {
      result = { ...alerts[0], isLocal: false };
    }

    CAP_CACHE = result;
    CAP_TIMESTAMP = now;

    console.log('🌍 BMKG FINAL:', result);

    return result;
  } catch (err) {
    console.log('❌ CAP ERROR:', err);
    return null;
  }
};

// ================================
// NEAREST ADM4 FROM BACKEND (TIDAK DIUBAH)
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
