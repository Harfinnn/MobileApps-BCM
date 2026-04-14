import React, { createContext, useContext, useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';

const LocationContext = createContext<any>(null);

export const LocationProvider = ({ children }: any) => {
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    let watchId: number | null = null;

    const startGPS = async () => {
      /* =========================
         ⚡ 1. FAST LOCATION (CACHE / NETWORK)
      ========================= */
      Geolocation.getCurrentPosition(
        position => {
          console.log('⚡ FAST GPS:', position.coords);
          setLocation(position.coords);
        },
        error => {
          console.log('FAST GPS ERROR:', error);
        },
        {
          enableHighAccuracy: false, // 🔥 cepat banget
          timeout: 5000,
          maximumAge: 20000, // 🔥 pakai cache GPS
        },
      );

      /* =========================
         🎯 2. ACCURATE GPS (REAL UPDATE)
      ========================= */
      watchId = Geolocation.watchPosition(
        position => {
          console.log('🎯 GPS UPDATE:', position.coords);
          setLocation(position.coords);
        },
        error => {
          console.log('GPS ERROR:', error);
        },
        {
          enableHighAccuracy: true, // 🔥 akurat tapi belakangan
          distanceFilter: 100, // 🔥 update tiap 10 meter
          interval: 7000, // 🔥 5 detik
          fastestInterval: 4000,
        },
      );
    };

    startGPS();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
