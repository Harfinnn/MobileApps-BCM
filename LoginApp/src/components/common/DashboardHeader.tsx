import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Bell, ArrowLeft, Search, XCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useLayout } from '../../contexts/LayoutContext';
import { useUser } from '../../contexts/UserContext';
import ProfileMenu from '../menu/ProfileMenu';
import NotificationMenu from '../menu/NotificationMenu';
import { styles } from '../../styles/headerStyle';

type Props = {
  onLogoutPress?: () => void;
};

export default function DashboardHeader({ onLogoutPress }: Props) {
  const { user } = useUser();
  const navigation = useNavigation<any>();
  const { showBack, onBack } = useLayout();

  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (showBack) {
      setSearchMode(false);
      setSearch('');
    }
  }, [showBack]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main', {
        screen: 'Home',
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getInitial = (nama?: string) => {
    if (!nama) return 'U';
    const parts = nama.trim().split(' ');
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userNama = user?.user_nama;
  const userFoto = user?.user_foto;

  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.pill,
              showBack
                ? {
                    width: 50,
                    paddingHorizontal: 0,
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }
                : searchMode
                ? {
                    width: 219,
                  }
                : {
                    width: '60%',
                  },
            ]}
          >
            <View style={styles.left}>
              {showBack ? (
                <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                  <ArrowLeft size={25} color="#111827" />
                </TouchableOpacity>
              ) : searchMode ? (
                <View style={styles.searchPill}>
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    autoFocus
                    placeholder="Search..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchInput}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setSearch('');
                      setSearchMode(false);
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <XCircle size={20} color="#EF4444" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text style={styles.greetingSmall}>{getGreeting()}</Text>
                  <Text style={styles.greetingName}>{userNama ?? 'User'}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.rightActions}>
            {!showBack && (
              <TouchableOpacity
                style={styles.searchBtn}
                onPress={() => {
                  setSearchMode(true);
                  setShowMenu(false);
                  setShowNotif(false);
                }}
              >
                <Search size={24} color="#F8AD3CFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.bellWrapper}
              onPress={() => {
                setShowNotif(true);
                setShowMenu(false);
              }}
            >
              <Bell size={24} color="#F8AD3CFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
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

      <ProfileMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onLogout={onLogoutPress ?? (() => {})}
      />

      <NotificationMenu
        visible={showNotif}
        onClose={() => setShowNotif(false)}
      />
    </>
  );
}
