import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  User,
  Settings,
  Lock,
  Info,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';

import ConfirmLogoutModal from '../../../components/modal/ConfirmLogoutModal';
import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import { resolveImageUri } from '../../../utils/image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '../../../components/common/Avatar';
import { styles } from '../../../styles/profile/profileStyle';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();

  const { user, loading, setUser } = useUser();

  const [showLogout, setShowLogout] = useState(false);

  const isAdmin = Number(user?.user_jabatan) === 1;

  /*
  ===============================
  LAYOUT CONFIG
  ===============================
  */
  useFocusEffect(
    useCallback(() => {
      setTitle('Profile');
      setHideNavbar(true);
      setShowBack(true);
      setShowSearch(false);

      setOnBack(() => () => {
        navigation.navigate('Main', { screen: 'Home' });
        return true;
      });

      return () => {
        setOnBack(undefined);
      };
    }, [
      user,
      loading,
      navigation,
      setHideNavbar,
      setOnBack,
      setShowBack,
      setShowSearch,
      setTitle,
    ]),
  );

  /*
  ===============================
  HARDWARE BACK
  ===============================
  */
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('Main', { screen: 'Home' });
        return true;
      });

      return () => sub.remove();
    }, [navigation]),
  );

  /*
  ===============================
  AVATAR
  ===============================
  */
  const avatarUri = useMemo(
    () => resolveImageUri(user?.user_foto),
    [user?.user_foto],
  );

  const initial = useMemo(
    () => user?.user_nama?.charAt(0).toUpperCase() ?? '',
    [user],
  );

  /*
  ===============================
  LOADING STATE
  ===============================
  */
  if (loading || !user) {
    return (
      <LinearGradient
        colors={['#009B97', '#007A77']}
        style={styles.container}
      />
    );
  }

  /*
  ===============================
  LOGOUT
  ===============================
  */
  const handleLogout = () => {
    setShowLogout(true);
  };

  const confirmLogout = async () => {
    setShowLogout(false);
    await setUser(null);
  };

  return (
    <>
      <LinearGradient
        colors={['#009B97', '#007A77']}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 70 }]}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGlow}>
              <Avatar uri={avatarUri} initial={initial} size={96} />
            </View>

            <Text style={styles.name}>{user.user_nama}</Text>

            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user.jabatan?.jab_nama ?? 'Viewer'}
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.sectionLabel}>AKUN & INFORMASI</Text>

          <MenuItem
            icon={<User size={18} color="#009B97" />}
            label="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />

          {isAdmin && (
            <MenuItem
              icon={<Settings size={18} color="#009B97" />}
              label="Pengaturan Info Aplikasi"
              onPress={() => navigation.navigate('EditAbout')}
            />
          )}

          <Text style={styles.sectionLabel}>PRIVASI & KEAMANAN</Text>

          <MenuItem
            icon={<Lock size={18} color="#009B97" />}
            label="Ganti Password"
            onPress={() =>
              navigation.navigate('ChangePassword', {
                user_id: user.user_id,
                fromProfile: true,
              })
            }
          />

          <MenuItem
            icon={<Info size={18} color="#009B97" />}
            label="Tentang"
            onPress={() => navigation.navigate('About')}
          />

          {/* LOGOUT */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color="#EF4444" />
            <Text style={styles.logoutText}>Keluar Akun</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* LOGOUT MODAL */}
      <ConfirmLogoutModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}

/*
===============================
MENU ITEM
===============================
*/

const MenuItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <View style={styles.menuIconBg}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>

    <ChevronRight size={18} color="#CBD5E1" />
  </TouchableOpacity>
);
