import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = ({ navigation }: any) => {

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');

      setTimeout(() => {
        if (token) {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      }, 1200);
    };

    checkToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/newfavicon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00A39D',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  text: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
