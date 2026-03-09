import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API, { setAuthToken } from '../services/api';
import LogoutAlert from '../components/modal/LogoutAlert';

export type User = {
  user_id: number;
  user_nama: string;
  user_status?: number;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  loading: boolean;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: async () => {},
  loading: true,
  logout: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  /*
  ========================================
  MANUAL LOGOUT
  ========================================
  */
  const logout = async () => {
    console.log('Manual logout');

    await AsyncStorage.multiRemove(['user', 'token']);

    setAuthToken(null);

    setUserState(null);
  };

  /*
  ========================================
  FORCE LOGOUT (ADMIN DISABLE)
  ========================================
  */
  const forceLogout = async () => {
    console.log('Force logout triggered');

    setShowLogoutAlert(true);
  };

  /*
  ========================================
  CONFIRM LOGOUT FROM MODAL
  ========================================
  */
  const confirmLogout = async () => {
    setShowLogoutAlert(false);

    await AsyncStorage.multiRemove(['user', 'token']);

    setAuthToken(null);

    setUserState(null);
  };

  /*
  ========================================
  RESTORE LOGIN SAAT APP START
  ========================================
  */
  useEffect(() => {
    const restore = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          setLoading(false);
          return;
        }

        setAuthToken(token);

        const res = await API.get('/me');

        const user = res.data.user;

        setUserState(user);

        await AsyncStorage.setItem('user', JSON.stringify(user));
      } catch (err) {
        console.log('Session invalid');

        await logout();
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  /*
  ========================================
  INTERVAL CHECK USER STATUS (30 DETIK)
  ========================================
  */
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {

      console.log('Checking user status...');

      try {
        const res = await API.get('/me');

        const serverUser = res.data.user;

        if (serverUser.user_status === 0) {
          console.log('User disabled by admin');

          forceLogout();
        }
      } catch (err) {
        console.log('Session expired');

        forceLogout();
      }
    }, 30000); // 30 detik

    return () => clearInterval(interval);
  }, [user]);

  /*
  ========================================
  SET USER
  ========================================
  */
  const setUser = async (newUser: User | null) => {
    if (!newUser) {
      await logout();
      return;
    }

    setUserState(newUser);

    await AsyncStorage.setItem('user', JSON.stringify(newUser));
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      logout,
    }),
    [user, loading],
  );

  return (
    <>
      <UserContext.Provider value={value}>{children}</UserContext.Provider>

      {/* MODAL LOGOUT */}
      <LogoutAlert visible={showLogoutAlert} onConfirm={confirmLogout} />
    </>
  );
};

export const useUser = () => useContext(UserContext);
