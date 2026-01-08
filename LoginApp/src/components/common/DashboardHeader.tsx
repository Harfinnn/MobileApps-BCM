import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Bell } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileMenu from '../menu/ProfileMenu';
import NotificationMenu from '../menu/NotificationMenu';
import { styles } from '../../styles/headerStyle';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useLayout } from '../../contexts/LayoutContext';

type Props = {
  title?: string;
  onProfilePress?: () => void;
  onLogoutPress?: () => void;
  backgroundColor?: string;
};

export default function DashboardHeader({
  onProfilePress,
  onLogoutPress,
}: Props) {
  const [userNama, setUserNama] = useState<string | undefined>();
  const [userFoto, setUserFoto] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning');

  const navigation = useNavigation<any>();
  const { showBack } = useLayout();

  useEffect(() => {
    const loadUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setUserNama(user.user_nama);
        setUserFoto(user.user_foto ?? null);
      }
      setGreeting(getGreeting());
    };
    loadUser();
  }, []);

  const getInitial = (nama?: string) => {
    if (!nama || nama.trim().length === 0) return 'U';
    const parts = nama.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const goToProfile = () => {
    setShowMenu(false);
    onProfilePress?.();
  };

  const logout = async () => {
    setShowMenu(false);
    onLogoutPress?.();
  };

  return (
    <>
      {/* HEADER */}
      <View style={styles.wrapper}>
        <View style={styles.pill}>
          {/* LEFT: BACK + TITLE */}
          <View style={styles.left}>
            {showBack ? (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.navigate('Main', { screen: 'Home' });
                  }
                }}
              >
                <ArrowLeft size={20} color="#111827" />
              </TouchableOpacity>
            ) : (
              <View>
                <Text style={styles.greetingSmall}>{greeting},</Text>
                <Text style={styles.greetingName}>{userNama ?? 'User'}</Text>
              </View>
            )}
          </View>

          {/* RIGHT: ACTIONS */}
          <View style={styles.actions}>
            {/* NOTIFICATION */}
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.7}
              onPress={() => {
                setShowNotif(true);
                setShowMenu(false);
              }}
            >
              <Bell size={20} color="#F8AD3CFF" />
            </TouchableOpacity>

            {/* PROFILE */}
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.7}
              onPress={() => {
                setShowMenu(true);
                setShowNotif(false);
              }}
            >
              {userFoto ? (
                <Image source={{ uri: userFoto }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {getInitial(userNama)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 🔥 PROFILE DROPDOWN MENU */}
      <ProfileMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onProfile={goToProfile}
        onLogout={logout}
      />

      <NotificationMenu
        visible={showNotif}
        onClose={() => setShowNotif(false)}
      />
    </>
  );
}
