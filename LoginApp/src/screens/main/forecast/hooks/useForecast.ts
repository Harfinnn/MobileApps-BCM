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
import API from '../../../../services/api';

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

  const saveUserLocation = async (adm4Id: number) => {
    try {
      await API.post('/user-location', {
        adm4_id: adm4Id,
      });
    } catch (e) {
      console.log('Save location error', e);
    }
  };

  /* ==========================================
     CORE LOAD (ANTI DOUBLE FETCH)
  ========================================== */
  const loadForecast = useCallback(
    async (lat: number, lon: number, adm4: string, locationInfo?: any) => {
      try {
        const res = await fetchWeatherAPI(lat, lon, adm4);

        // 🔥 CEK FALLBACK / STALE DATA
        if (res.current?.stale) {
          console.log('⚠️ Weather data is stale');

          setWarning({
            type: 'alert',
            title: 'Data Terakhir Digunakan',
            description: 'Koneksi ke server cuaca sedang bermasalah.',
          });
        }

        const parsed = parseForecast(res.forecast);

        if (!isMountedRef.current) return;

        // 🔥 override suhu hari ini pakai realtime
        if (res.current && parsed.length > 0) {
          parsed[0].summary.temp = Math.floor(res.current.temperature_2m);
          parsed[0].summary.wind = Math.floor(res.current.wind_speed_10m ?? 0);
        }

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
        console.log('LOAD WEATHER ERROR:', err);
      }
    },
    [],
  );
  /* ==========================================
     INITIAL LOAD (INSTANT RENDER STRATEGY)
  ========================================== */
  const initForecast = useCallback(async () => {
    try {
      if (weatherData.length === 0) {
        setLoading(true);
      }

      const granted = await requestLocationPermission();
      if (!granted) {
        setLoading(false);
        return;
      }

      const coords = await getCurrentPosition();
      const nearest = await fetchNearestADM4(coords.latitude, coords.longitude);

      if (!nearest?.data?.adm4) {
        console.log('⚠️ ADM4 tidak ditemukan, fallback ke current only');

        const res = await fetchWeatherAPI(
          coords.latitude,
          coords.longitude,
          DEFAULT_ADM4, // hanya supaya endpoint tetap valid
        );

        if (res?.current) {
          const fallbackData: DailyForecast[] = [
            {
              summary: {
                temp: Math.floor(res.current.temperature_2m),
                wind: Math.floor(res.current.wind_speed_10m ?? 0),
                humidity: res.current.relative_humidity_2m ?? 0,
                condition: 'Data model global (Open-Meteo)',
                icon: 'cloud',
              },
            } as DailyForecast,
          ];

          setWeatherData(fallbackData);
        }

        setLocationName('Wilayah belum terdaftar di database');
        setLoading(false);
        return;
      }

      await loadForecast(
        coords.latitude,
        coords.longitude,
        nearest.data.adm4,
        nearest.data,
      );

      await saveUserLocation(nearest.data.id);

      setLoading(false);

      // 🔥 CAP non blocking
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
          setWarning({
            type: 'safe',
            title: 'Tidak Ada Peringatan Cuaca Aktif',
            description: 'Kondisi cuaca dalam keadaan normal.',
          });
        });
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
          await loadForecast(
            latitude,
            longitude,
            nearest.data.adm4,
            nearest.data,
          );
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
        await loadForecast(
          coords.latitude,
          coords.longitude,
          nearest.data.adm4,
          nearest.data,
        );
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
