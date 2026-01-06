import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayout } from '../../contexts/LayoutContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProfileScreen() {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  useEffect(() => {
    setTitle('Profile');
    setHideNavbar(true);
    setShowBack(true);

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
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  const getInitial = (name?: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    if (route.params?.updatedUser) {
      setUser((prev: any) => ({
        ...prev,
        ...route.params.updatedUser,
      }));
    }
  }, [route.params?.updatedUser]);

  return (
    <View style={styles.container}>
      {/* AVATAR */}
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

      {/* MENU */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },

  avatarWrapper: {
    alignItems: 'center',
    marginVertical: 24,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },

  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#374151',
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  email: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  menu: {
    marginTop: 32,
  },

  menuItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  menuText: {
    fontSize: 16,
    color: '#111827',
  },
});
