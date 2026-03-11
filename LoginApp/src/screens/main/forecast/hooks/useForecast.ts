import { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  fetchWeatherAPI,
  fetchCAPAPI,
  fetchNearestADM4,
} from '../../../../services/weatherService';

import { parseForecast } from '../../../../utils/weatherParser';
import { DailyForecast, WeatherWarning } from '../../../../types/forecast';
import { useLocation } from '../../../../contexts/LocationContext';

import { weatherCodeToCondition } from '../../../../utils/weatherCodeMapper';
import API from '../../../../services/api';

const DEFAULT_ADM4 = '31.71.03.1001';

const CACHE_DURATION = 10 * 60 * 1000; // 10 menit

const DEFAULT_WARNING: WeatherWarning = {
  type: 'safe',
  title: 'Memuat informasi peringatan...',
  description: 'Sedang memeriksa kondisi cuaca terkini.',
};

export const useForecast = () => {
  const location = useLocation();

  const [weatherData, setWeatherData] = useState<DailyForecast[]>([]);
  const [locationName, setLocationName] = useState('');
  const [warning, setWarning] = useState<WeatherWarning | null>(
    DEFAULT_WARNING,
  );
  const [loading, setLoading] = useState(true);

  const lastAdm4Ref = useRef<string | null>(null);
  const lastFetchRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  const saveUserLocation = async (adm4Id: number) => {
    try {
      await API.post('/user-location', { adm4_id: adm4Id });
    } catch {}
  };

  /* ==============================
     LOAD CACHE (instant open)
  ============================== */

  useEffect(() => {
    const loadCache = async () => {
      try {
        const cache = await AsyncStorage.getItem('weather_cache');

        if (!cache) return;

        const parsed = JSON.parse(cache);

        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
          setWeatherData(parsed.data);
          setLoading(false);
        }
      } catch (e) {
        console.log('CACHE LOAD ERROR:', e);
      }
    };

    loadCache();
  }, []);

  /* ==============================
     LOAD FORECAST
  ============================== */

  const loadForecast = useCallback(
    async (lat: number, lon: number, adm4: string) => {
      if (lastAdm4Ref.current === adm4) return;

      lastAdm4Ref.current = adm4;

      try {
        const [res, capRes] = await Promise.all([
          fetchWeatherAPI(lat, lon, adm4),
          fetchCAPAPI().catch(() => null),
        ]);

        if (!isMountedRef.current) return;

        const parsed = parseForecast(res.forecast);

        if (res.current && parsed.length > 0) {
          parsed[0].summary.temp = Math.floor(res.current.temperature_2m);
          parsed[0].summary.wind = Math.floor(res.current.wind_speed_10m ?? 0);
          parsed[0].summary.condition = weatherCodeToCondition(
            res.current.weather_code,
          );
        }

        setWeatherData(parsed);

        // save cache
        await AsyncStorage.setItem(
          'weather_cache',
          JSON.stringify({
            data: parsed,
            timestamp: Date.now(),
            lat,
            lon,
          }),
        );

        const autoWarning = generateWeatherCodeWarning(res.current);
        setWarning(capRes ?? autoWarning);
      } catch (err) {
        console.log('LOAD WEATHER ERROR:', err);
      }
    },
    [],
  );

  /* ==============================
     LOCATION EFFECT
  ============================== */

  useEffect(() => {
    if (!location) return;

    const run = async () => {
      const now = Date.now();

      // debounce request
      if (now - lastFetchRef.current < 60000) return;
      lastFetchRef.current = now;

      try {
        const nearest = await fetchNearestADM4(
          location.latitude,
          location.longitude,
        );

        if (!nearest?.data?.adm4) return;

        const newAdm4 = nearest.data.adm4;

        // skip jika adm4 sama
        if (lastAdm4Ref.current === newAdm4) {
          setLoading(false);
          return;
        }

        await loadForecast(location.latitude, location.longitude, newAdm4);

        const parts = [
          nearest.data.kelurahan,
          nearest.data.kecamatan,
          nearest.data.kotkab,
        ].filter(Boolean);

        setLocationName(parts.join(', '));

        saveUserLocation(nearest.data.id).catch(() => {});

        setLoading(false);
      } catch (e) {
        console.log('FORECAST ERROR:', e);
      }
    };

    run();
  }, [location, loadForecast]);

  /* ==============================
     MANUAL REFRESH
  ============================== */

  const refetch = async () => {
    if (!location) return;

    const nearest = await fetchNearestADM4(
      location.latitude,
      location.longitude,
    );

    if (!nearest?.data?.adm4) return;

    lastAdm4Ref.current = null;

    await loadForecast(
      location.latitude,
      location.longitude,
      nearest.data.adm4,
    );
  };

  /* ==============================
     CLEANUP
  ============================== */

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    weatherData,
    warning,
    loading,
    locationName,
    refetch,
  };
};

/* ==============================
   WARNING GENERATOR
============================== */

const generateWeatherCodeWarning = (current: any): WeatherWarning => {
  if (!current) {
    return {
      type: 'safe',
      title: 'Data Cuaca Tidak Tersedia',
      description: 'Tidak dapat memuat kondisi cuaca terkini.',
    };
  }

  const weather_code = current?.weather_code ?? 0;
  const wind_speed_10m = current?.wind_speed_10m ?? 0;

  if (weather_code >= 95)
    return {
      type: 'alert',
      title: 'Badai Petir',
      description: 'Potensi hujan deras.',
    };

  if (wind_speed_10m >= 50)
    return {
      type: 'alert',
      title: 'Angin Kencang',
      description: 'Angin sangat kuat.',
    };

  if (weather_code === 65 || weather_code === 82)
    return {
      type: 'alert',
      title: 'Hujan Lebat',
      description: 'Curah hujan tinggi.',
    };

  if (weather_code === 63 || weather_code === 81)
    return {
      type: 'warning',
      title: 'Hujan Sedang',
      description: 'Hujan intensitas sedang.',
    };

  if (weather_code === 61 || weather_code === 80)
    return {
      type: 'warning',
      title: 'Hujan Ringan',
      description: 'Hujan ringan.',
    };

  if (weather_code === 45 || weather_code === 48)
    return {
      type: 'warning',
      title: 'Kabut Tebal',
      description: 'Jarak pandang berkurang.',
    };

  if (weather_code === 3)
    return {
      type: 'info',
      title: 'Mendung Tebal',
      description: 'Langit mendung.',
    };

  return {
    type: 'safe',
    title: 'Tidak Ada Peringatan Cuaca Aktif',
    description: 'Kondisi cuaca normal.',
  };
};
