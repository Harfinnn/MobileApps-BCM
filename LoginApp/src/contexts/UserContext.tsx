import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API, { setAuthToken } from '../services/api';

export type User = {
  user_id: number;
  user_nama: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: async () => {},
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 RESTORE LOGIN SAAT APP START
  useEffect(() => {
    const restore = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const rawUser = await AsyncStorage.getItem('user');

        if (token) {
          setAuthToken(token);
        }

        if (rawUser) {
          setUserState(JSON.parse(rawUser));
        }
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const setUser = async (newUser: User | null) => {
    if (!newUser) {
      await AsyncStorage.multiRemove(['user', 'token']);
      setAuthToken(null);
      setUserState(null);
      return;
    }

    setUserState(newUser);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
  };

  const value = useMemo(() => ({ user, setUser, loading }), [user, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
