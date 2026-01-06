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
};

export default function DashboardHeader({
  title = 'Test',
  onProfilePress,
  onLogoutPress,
}: Props) {
  const [userNama, setUserNama] = useState<string | undefined>();
  const [userFoto, setUserFoto] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

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
    };
    loadUser();
  }, []);

  const getInitial = (nama?: string) => {
    if (!nama || nama.trim().length === 0) return 'U';
    const parts = nama.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
            {showBack && (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.navigate('Main', {
                      screen: 'Home',
                    });
                  }
                }}
              >
                <ArrowLeft size={20} color="#111827" />
              </TouchableOpacity>
            )}

            <Text style={styles.title}>{title}</Text>
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
