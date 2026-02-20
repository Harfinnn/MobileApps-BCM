import { useEffect, useState, useRef, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';

import {
  fetchForecastAPI,
  fetchCAPAPI,
  fetchNearestADM4,
} from '../../../../services/weatherService';

import { parseForecast } from '../../../../utils/weatherParser';
import { DailyForecast, WeatherWarning } from '../../../../types/forecast';

import {
  getCurrentPosition,
  requestLocationPermission,
} from '../../../../services/locationService';

const DEFAULT_ADM4 = '31.71.03.1001';

const DEFAULT_WARNING: WeatherWarning = {
  type: 'safe',
  title: 'Memuat informasi peringatan...',
  description: 'Sedang memeriksa kondisi cuaca terkini.',
};

export const useForecast = () => {
  const [weatherData, setWeatherData] = useState<DailyForecast[]>([]);
  const [locationName, setLocationName] = useState('');
  const [warning, setWarning] = useState<WeatherWarning | null>(
    DEFAULT_WARNING,
  );
  const [loading, setLoading] = useState(true);

  const lastAdm4Ref = useRef<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  /* ==========================================
     CORE LOAD (ANTI DOUBLE FETCH)
  ========================================== */
  const loadForecast = useCallback(async (adm4: string, locationInfo?: any) => {
    try {
      if (lastAdm4Ref.current === adm4) return;

      lastAdm4Ref.current = adm4;

      const forecastRes = await fetchForecastAPI(adm4);
      const parsed = parseForecast(forecastRes);

      if (!isMountedRef.current) return;

      setWeatherData(parsed);

      if (locationInfo) {
        const parts = [
          locationInfo.kelurahan,
          locationInfo.kecamatan,
          locationInfo.kotkab,
        ].filter(Boolean);

        setLocationName(parts.join(', '));
      }
    } catch (err) {
      console.log('LOAD FORECAST ERROR:', err);
    }
  }, []);

  /* ==========================================
     INITIAL LOAD (INSTANT RENDER STRATEGY)
  ========================================== */
  const initForecast = useCallback(async () => {
    try {
      if (weatherData.length === 0) {
        setLoading(true);
      }

      // 🔥 1️⃣ LOAD DEFAULT DULU (SUPER CEPAT)
      loadForecast(DEFAULT_ADM4);

      setLoading(false);

      // 🔥 2️⃣ FETCH CAP (NON BLOCKING)
      fetchCAPAPI()
        .then(capRes => {
          if (!isMountedRef.current) return;

          setWarning(
            capRes ?? {
              type: 'safe',
              title: 'Tidak Ada Peringatan Cuaca Aktif',
              description: 'Kondisi cuaca dalam keadaan normal.',
            },
          );
        })
        .catch(() => {
          if (!isMountedRef.current) return;

          setWarning({
            type: 'safe',
            title: 'Tidak Ada Peringatan Cuaca Aktif',
            description: 'Kondisi cuaca dalam keadaan normal.',
          });
        });

      // 🔥 3️⃣ BACKGROUND UPDATE VIA GPS
      const granted = await requestLocationPermission();
      if (!granted) return;

      const coords = await getCurrentPosition();

      const nearest = await fetchNearestADM4(coords.latitude, coords.longitude);

      if (nearest?.data?.adm4 && nearest.data.adm4 !== DEFAULT_ADM4) {
        await loadForecast(nearest.data.adm4, nearest.data);
      }
    } catch (error) {
      console.log('INIT ERROR:', error);
      setLoading(false);
    }
  }, [loadForecast, weatherData.length]);

  /* ==========================================
     REALTIME WATCH (DELAYED START)
  ========================================== */
  const startRealtimeWatch = async () => {
    const granted = await requestLocationPermission();
    if (!granted) return;

    watchIdRef.current = Geolocation.watchPosition(
      async position => {
        const { latitude, longitude } = position.coords;

        const nearest = await fetchNearestADM4(latitude, longitude);

        if (nearest?.data?.adm4) {
          await loadForecast(nearest.data.adm4, nearest.data);
        }
      },
      error => {
        console.log('WATCH ERROR:', error);
      },
      {
        enableHighAccuracy: false,
        distanceFilter: 1000,
        interval: 60000,
        fastestInterval: 30000,
      },
    );
  };

  /* ==========================================
     MANUAL REFRESH
  ========================================== */
  const fetchByCurrentLocation = async () => {
    try {
      const granted = await requestLocationPermission();
      if (!granted) return;

      const coords = await getCurrentPosition();

      const nearest = await fetchNearestADM4(coords.latitude, coords.longitude);

      if (nearest?.data?.adm4) {
        await loadForecast(nearest.data.adm4, nearest.data);
      }
    } catch (e) {
      console.log('GPS ERROR:', e);
    }
  };

  /* ==========================================
     EFFECT
  ========================================== */
  useEffect(() => {
    isMountedRef.current = true;

    initForecast();

    // 🔥 Delay realtime watch 5 detik
    const timer = setTimeout(() => {
      startRealtimeWatch();
    }, 5000);

    return () => {
      isMountedRef.current = false;

      clearTimeout(timer);

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
