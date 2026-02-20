import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  User,
  MapPin,
  Lock,
  Bell,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';

import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import { resolveImageUri } from '../../../utils/image';

import Avatar from '../../../components/common/Avatar';
import { styles } from '../../../styles/profile/profileStyle';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();
  const { user, loading, setUser } = useUser();

  useFocusEffect(
    useCallback(() => {
      if (!loading && !user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

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

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('Main', { screen: 'Home' });
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  const avatarUri = useMemo(
    () => resolveImageUri(user?.user_foto),
    [user?.user_foto],
  );

  const initial = useMemo(
    () => user?.user_nama?.charAt(0).toUpperCase() ?? '',
    [user],
  );

  if (loading || !user) {
    return (
      <LinearGradient
        colors={['#009B97', '#007A77']}
        style={styles.container}
      />
    );
  }

  const handleLogout = () => {
    Alert.alert('Keluar Akun', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await setUser(null);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <LinearGradient colors={['#009B97', '#007A77']} style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
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

      {/* ===== CONTENT ===== */}
      <View style={styles.content}>
        {/* MENU */}
        <Text style={styles.sectionLabel}>AKUN & INFORMASI</Text>
        <MenuItem
          icon={<User size={18} color="#009B97" />}
          label="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <MenuItem
          icon={<MapPin size={18} color="#009B97" />}
          label="Atur Alamat"
        />
        <MenuItem
          icon={<Bell size={18} color="#009B97" />}
          label="Notifikasi"
        />

        <Text style={styles.sectionLabel}>PRIVASI & KEAMANAN</Text>
        <MenuItem
          icon={<Lock size={18} color="#009B97" />}
          label="Ganti Password"
        />

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Keluar Akun</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const MenuItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <View style={styles.menuIconBg}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <ChevronRight size={18} color="#CBD5E1" />
  </TouchableOpacity>
);
