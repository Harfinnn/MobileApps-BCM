import React, { createContext, useContext, useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';

const LocationContext = createContext<any>(null);

export const LocationProvider = ({ children }: any) => {
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    let watchId: number | null = null;

    const startGPS = async () => {
      Geolocation.getCurrentPosition(
        position => {
          console.log('INITIAL GPS:', position.coords);
          setLocation(position.coords);
        },
        error => {
          console.log('INITIAL GPS ERROR:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );

      watchId = Geolocation.watchPosition(
        position => {
          console.log('GPS UPDATE:', position.coords);
          setLocation(position.coords);
        },
        error => {
          console.log('GPS ERROR:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 1000,
          interval: 120000,
          fastestInterval: 60000,
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
