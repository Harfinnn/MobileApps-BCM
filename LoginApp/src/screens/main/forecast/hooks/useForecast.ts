import { useEffect, useState, useRef, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';

import {
  fetchWeatherAPI,
  fetchCAPAPI,
  fetchNearestADM4,
} from '../../../../services/weatherService';

import { parseForecast } from '../../../../utils/weatherParser';
import { DailyForecast, WeatherWarning } from '../../../../types/forecast';

import {
  getCurrentPosition,
  requestLocationPermission,
} from '../../../../services/locationService';

import { weatherCodeToCondition } from '../../../../utils/weatherCodeMapper';
import API from '../../../../services/api';

const DEFAULT_ADM4 = '31.71.03.1001';

const DEFAULT_WARNING: WeatherWarning = {
  type: 'safe',
  title: 'Memuat informasi peringatan...',
  description: 'Sedang memeriksa kondisi cuaca terkini.',
};

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

  if (weather_code >= 95) {
    return {
      type: 'alert',
      title: 'Badai Petir',
      description: 'Terjadi badai petir dengan potensi hujan deras.',
    };
  }

  if (wind_speed_10m >= 50) {
    return {
      type: 'alert',
      title: 'Angin Kencang',
      description: 'Kecepatan angin tinggi terdeteksi.',
    };
  }

  if (weather_code === 65 || weather_code === 82) {
    return {
      type: 'alert',
      title: 'Hujan Lebat',
      description: 'Curah hujan tinggi terdeteksi.',
    };
  }

  if (weather_code === 63 || weather_code === 81) {
    return {
      type: 'warning',
      title: 'Hujan Sedang',
      description: 'Sedang terjadi hujan dengan intensitas sedang.',
    };
  }

  if (weather_code === 61 || weather_code === 80) {
    return {
      type: 'warning',
      title: 'Hujan Ringan',
      description: 'Terjadi hujan ringan di sekitar wilayah Anda.',
    };
  }

  if (weather_code === 45 || weather_code === 48) {
    return {
      type: 'warning',
      title: 'Kabut Tebal',
      description: 'Jarak pandang berkurang akibat kabut.',
    };
  }

  if (weather_code === 3) {
    return {
      type: 'info',
      title: 'Mendung Tebal',
      description: 'Langit mendung, kemungkinan hujan.',
    };
  }

  return {
    type: 'safe',
    title: 'Tidak Ada Peringatan Cuaca Aktif',
    description: 'Kondisi cuaca normal.',
  };
};

export const useForecast = () => {
  const [weatherData, setWeatherData] = useState<DailyForecast[]>([]);
  const [locationName, setLocationName] = useState('');
  const [warning, setWarning] = useState<WeatherWarning | null>(
    DEFAULT_WARNING,
  );
  const [loading, setLoading] = useState(true);

  const lastAdm4Ref = useRef<string | null>(null);
  const adm4CacheRef = useRef<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastWatchUpdateRef = useRef(0);
  const refreshLockRef = useRef(false);
  const isMountedRef = useRef(true);

  const saveUserLocation = async (adm4Id: number) => {
    try {
      await API.post('/user-location', {
        adm4_id: adm4Id,
      });
    } catch {}
  };

  /* ==============================
     LOAD FORECAST
  ============================== */
  const loadForecast = useCallback(
    async (lat: number, lon: number, adm4: string) => {
      try {
        if (lastAdm4Ref.current === adm4) return;
        lastAdm4Ref.current = adm4;

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

        const autoWarning = generateWeatherCodeWarning(res.current);
        setWarning(capRes ?? autoWarning);
      } catch (err) {
        console.log('LOAD WEATHER ERROR:', err);
      }
    },
    [],
  );

  /* ==============================
     INITIAL LOAD
  ============================== */
  const initForecast = useCallback(async () => {
    try {
      if (refreshLockRef.current) return;
      refreshLockRef.current = true;

      setLoading(true);

      const granted = await requestLocationPermission();
      if (!granted) {
        setLoading(false);
        refreshLockRef.current = false;
        return;
      }

      const coords = await getCurrentPosition();

      const adm4 = adm4CacheRef.current ?? DEFAULT_ADM4;

      await loadForecast(coords.latitude, coords.longitude, adm4);

      setLoading(false);

      const nearest = await fetchNearestADM4(coords.latitude, coords.longitude);

      if (nearest?.data?.adm4) {
        adm4CacheRef.current = nearest.data.adm4;

        await loadForecast(
          coords.latitude,
          coords.longitude,
          nearest.data.adm4,
        );

        const parts = [
          nearest.data.kelurahan,
          nearest.data.kecamatan,
          nearest.data.kotkab,
        ].filter(Boolean);

        const newLocation = parts.join(', ');

        setLocationName(prev => (prev === newLocation ? prev : newLocation));

        saveUserLocation(nearest.data.id).catch(() => {});
      }

      startRealtimeWatch();

      refreshLockRef.current = false;
    } catch (error) {
      console.log('INIT ERROR:', error);
      setLoading(false);
      refreshLockRef.current = false;
    }
  }, [loadForecast]);

  /* ==============================
     REALTIME WATCH
  ============================== */
  const startRealtimeWatch = () => {
    watchIdRef.current = Geolocation.watchPosition(
      async position => {
        const now = Date.now();

        if (now - lastWatchUpdateRef.current < 120000) return;

        lastWatchUpdateRef.current = now;

        const { latitude, longitude } = position.coords;

        const nearest = await fetchNearestADM4(latitude, longitude);

        if (nearest?.data?.adm4) {
          adm4CacheRef.current = nearest.data.adm4;

          await loadForecast(latitude, longitude, nearest.data.adm4);
        }
      },
      error => {
        console.log('WATCH ERROR:', error);
      },
      {
        enableHighAccuracy: false,
        distanceFilter: 1500,
        interval: 120000,
        fastestInterval: 60000,
      },
    );
  };

  /* ==============================
     MANUAL REFRESH
  ============================== */
  const fetchByCurrentLocation = async () => {
    try {
      const coords = await getCurrentPosition();

      const nearest = await fetchNearestADM4(coords.latitude, coords.longitude);

      if (nearest?.data?.adm4) {
        adm4CacheRef.current = nearest.data.adm4;

        await loadForecast(
          coords.latitude,
          coords.longitude,
          nearest.data.adm4,
        );
      }
    } catch (e) {
      console.log('GPS ERROR:', e);
    }
  };

  /* ==============================
     EFFECT
  ============================== */
  useEffect(() => {
    isMountedRef.current = true;

    initForecast();

    return () => {
      isMountedRef.current = false;

      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [initForecast]);

  return {
    weatherData,
    warning,
    loading,
    refetch: initForecast,
    fetchByCurrentLocation,
    locationName,
  };
};
