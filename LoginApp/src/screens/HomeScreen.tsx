import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationBar from '../components/NavigationBar';
import HeaderProfile from '../components/HeaderProfile';
import ImageSlider from '../components/ImageSlider';

const HomeScreen = ({ navigation }: any) => {
  const [nama, setNama] = useState('User');

  useEffect(() => {
    const loadUser = async () => {
      const userString = await AsyncStorage.getItem('user');

      if (userString) {
        const user = JSON.parse(userString);
        setNama(user.user_nama);
      }
    };
    loadUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 11) return 'Good Morning ';
    if (hour >= 11 && hour < 15) return 'Good Afternoon ';
    if (hour >= 15 && hour < 19) return 'Good Evening ';
    return 'Good Night 🌙';
  };

  return (
    <>
      <HeaderProfile />

      <ImageSlider />

      {/* GREETING */}
      <View style={styles.greetingCard}>
        <Text style={styles.greetingSmall}>{getGreeting()}</Text>
        <Text style={styles.greetingName}>{nama} </Text>
      </View>

      <View style={styles.container}>
        <Text>Kamu sudah login</Text>
        <View style={{ marginTop: 20 }}>
          <Button title="Logout" onPress={logout} />
        </View>
      </View>

      <NavigationBar />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  greetingCard: {
    marginTop: 16,
    marginHorizontal: 18,
    padding: 10,
    borderRadius: 14,
    borderColor: 'rgba(18, 203, 236, 1)',
    borderWidth: 2,
    backgroundColor: '#F9FAFB',
  },

  greetingSmall: {
    fontSize: 13,
    color: '#F8AD3CFF',
  },

  greetingName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
