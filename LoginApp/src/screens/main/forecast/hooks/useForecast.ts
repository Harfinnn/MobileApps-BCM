import { useEffect, useState, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  fetchWeatherAPI,
  fetchCAPAPI,
} from '../../../../services/weatherService';

import { getDistrictFromSupabase } from '../../../../services/districtService';

import { parseForecast } from '../../../../utils/weatherParser';
import { DailyForecast, WeatherWarning } from '../../../../types/forecast';
import { useLocation } from '../../../../contexts/LocationContext';

const CACHE_DURATION = 10 * 60 * 1000;
const REFETCH_INTERVAL = 15 * 60 * 1000;

const DEFAULT_WARNING: WeatherWarning = {
  type: 'safe',
  title: 'Memuat informasi peringatan...',
  description: 'Sedang memeriksa kondisi cuaca terkini.',
};

export const useForecast = () => {
  const location = useLocation();

  const [weatherData, setWeatherData] = useState<DailyForecast[]>([]);
  const [locationName, setLocationName] = useState('');
  const [warnings, setWarnings] = useState<WeatherWarning[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const lastFetchRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  /* ==============================
     LOAD FORECAST
  ============================== */

  const loadForecast = useCallback(async (lat: number, lon: number) => {
    try {
      const [res, districtRes, capRes] = await Promise.all([
        fetchWeatherAPI(lat, lon),
        getDistrictFromSupabase(lat, lon),
        fetchCAPAPI().catch(() => null),
      ]);

      if (!isMountedRef.current) return;

      /* ======================
       PARSE WEATHER
    ====================== */

      const parsed = parseForecast(res.forecast);

      if (res.current && parsed.length > 0) {
        parsed[0].summary.temp = Math.floor(res.current.main.temp);
        parsed[0].summary.wind = Math.floor(
          (res.current.wind?.speed ?? 0) * 3.6,
        );

        const desc = res.current.weather[0].description;
        parsed[0].summary.condition =
          desc.charAt(0).toUpperCase() + desc.slice(1);
      }

      setWeatherData(parsed);

      /* ======================
       FIX DISTRICT (INI KUNCI 🔥)
    ====================== */

      const district = districtRes?.[0]; // ⬅️ FIX DI SINI

      console.log('📍 DISTRICT RESULT:', district);

      if (district) {
        const locName = `${district.district}, ${district.city}`;
        setLocationName(locName);
      } else {
        setLocationName('Lokasi tidak ditemukan');
      }

      /* ======================
       CACHE
    ====================== */

      await AsyncStorage.setItem(
        'weather_cache',
        JSON.stringify({
          data: parsed,
          timestamp: Date.now(),
          lat,
          lon,
        }),
      );

      /* ======================
       WARNING
    ====================== */

      const autoWarning = generateWeatherCodeWarning(res.current);

      let list: WeatherWarning[] = [];

      if (capRes && capRes.isLocal) {
        list.push({
          type: 'alert',
          title: capRes.title,
          description: capRes.description,
        });
      } else {
        list.push(autoWarning);
      }

      setWarnings(list);
    } catch (err) {
      console.log('LOAD WEATHER ERROR:', err);
    }
  }, []);

  /* ==============================
     REFETCH
  ============================== */

  const refetch = useCallback(async () => {
    if (!location) return;

    await loadForecast(location.latitude, location.longitude);
  }, [location, loadForecast]);

  /* ==============================
     INITIAL LOAD
  ============================== */

  useEffect(() => {
    if (!location) return;

    const run = async () => {
      const now = Date.now();

      if (now - lastFetchRef.current < 60000) return;
      lastFetchRef.current = now;

      try {
        await loadForecast(location.latitude, location.longitude);
        setLoading(false);
      } catch (e) {
        console.log('FORECAST ERROR:', e);
      }
    };

    run();
  }, [location, loadForecast]);

  /* ==============================
     AUTO REFRESH
  ============================== */

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('🔄 AUTO REFRESH');
      lastFetchRef.current = Date.now();
      refetch();
    }, REFETCH_INTERVAL);

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        const now = Date.now();

        if (now - lastFetchRef.current > REFETCH_INTERVAL) {
          console.log('☀️ APP ACTIVE REFRESH');
          lastFetchRef.current = now;
          refetch();
        }
      }
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [refetch]);

  /* ==============================
     CURRENT WARNING
  ============================== */

  const currentWarning = warnings[activeIndex] || DEFAULT_WARNING;

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
    warning: currentWarning,
    warnings,
    loading,
    locationName,
    refetch,
  };
};

/* ==============================
   WARNING GENERATOR
============================== */

const generateWeatherCodeWarning = (current: any): WeatherWarning => {
  if (!current || !current.weather || current.weather.length === 0) {
    return {
      type: 'safe',
      title: 'Data Cuaca Tidak Tersedia',
      description: 'Tidak dapat memuat kondisi cuaca terkini.',
    };
  }

  const weatherId = current.weather[0].id;
  const wind_speed = (current.wind?.speed ?? 0) * 3.6;

  if (wind_speed >= 50)
    return {
      type: 'alert',
      title: 'Angin Kencang',
      description: 'Angin sangat kuat.',
    };

  if (weatherId >= 200 && weatherId < 300)
    return {
      type: 'alert',
      title: 'Badai Petir',
      description: 'Potensi badai dan petir.',
    };

  if (weatherId === 502 || weatherId === 503 || weatherId === 504)
    return {
      type: 'alert',
      title: 'Hujan Lebat',
      description: 'Curah hujan tinggi.',
    };

  if (weatherId >= 500 && weatherId < 502)
    return {
      type: 'warning',
      title: 'Hujan Sedang',
      description: 'Hujan intensitas sedang.',
    };

  if (weatherId >= 300 && weatherId < 400)
    return {
      type: 'warning',
      title: 'Gerimis',
      description: 'Hujan gerimis ringan.',
    };

  if (weatherId === 701 || weatherId === 741)
    return {
      type: 'warning',
      title: 'Kabut Tebal',
      description: 'Jarak pandang berkurang.',
    };

  if (weatherId > 802)
    return {
      type: 'info',
      title: 'Mendung Tebal',
      description: 'Langit mendung tertutup awan.',
    };

  return {
    type: 'safe',
    title: 'Tidak Ada Peringatan Cuaca Aktif',
    description: 'Kondisi cuaca normal.',
  };
};
