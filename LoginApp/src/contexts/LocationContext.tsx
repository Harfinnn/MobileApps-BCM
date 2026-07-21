import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { AppState, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const LocationContext = createContext<any>(null);

export const LocationProvider = ({ children }: any) => {
  const [location, setLocation] = useState<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  const hasPermission = useCallback(async () => {
    if (Platform.OS !== 'android') return true; 
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }, []);

  const startGPS = useCallback(() => {
    if (startedRef.current) return; 
    startedRef.current = true;

    Geolocation.getCurrentPosition(
      position => setLocation(position.coords),
      error => console.log('FAST GPS ERROR:', error),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 20000 },
    );

    watchIdRef.current = Geolocation.watchPosition(
      position => setLocation(position.coords),
      error => console.log('GPS ERROR:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 100,
        interval: 7000,
        fastestInterval: 4000,
      },
    );
  }, []);

  const tryStart = useCallback(async () => {
    const granted = await hasPermission();
    if (granted) startGPS();
  }, [hasPermission, startGPS]);

  useEffect(() => {
    tryStart(); // percobaan pertama saat app dibuka

    // 🔑 kunci perbaikan: retry setiap app kembali ke foreground
    // (mis. setelah dialog izin sistem, atau user kasih izin lewat Settings)
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active' && !startedRef.current) {
        tryStart();
      }
    });

    return () => {
      sub.remove();
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [tryStart]);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
