import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useLayout } from '../../contexts/LayoutContext';
import { styles } from '../../styles/profileStyle';

export default function ProfileScreen() {
  const { setTitle, setHideNavbar, setShowBack, setOnBack } = useLayout();
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  /* =====================
     LAYOUT SETUP
  ===================== */
  useEffect(() => {
    setTitle('Profile');
    setHideNavbar(true);
    setShowBack(true);

    // back via HEADER -> Home
    setOnBack(() => () => {
      navigation.navigate('Main', {
        screen: 'Home',
      });
    });

    const loadUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        setUser(JSON.parse(userString));
      }
    };

    loadUser();

    return () => {
      setHideNavbar(false);
      setShowBack(false);
      setOnBack(undefined);
    };
  }, [navigation, setTitle, setHideNavbar, setShowBack, setOnBack]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.navigate('Main', { screen: 'Home' });
          return true;
        },
      );

      return () => {
        subscription.remove();
      };
    }, [navigation]),
  );

  useEffect(() => {
    if (route.params?.updatedUser) {
      setUser((prev: any) => ({
        ...prev,
        ...route.params.updatedUser,
      }));
    }
  }, [route.params?.updatedUser]);

  const getInitial = (name?: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <LinearGradient
      colors={['#009B97', '#F8AD3C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.avatarWrapper}>
        {user?.user_foto ? (
          <Image source={{ uri: user.user_foto }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getInitial(user?.user_nama)}</Text>
          </View>
        )}

        <Text style={styles.name}>{user?.user_nama ?? 'User'}</Text>
        <Text style={styles.email}>{user?.user_email ?? '-'}</Text>
      </View>

      <View style={styles.menuCard}>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.menuText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Atur Alamat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Ganti Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
