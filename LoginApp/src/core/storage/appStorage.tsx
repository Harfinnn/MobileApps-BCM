import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'APP_CONFIG';

export const saveAppConfig = async (data: any) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const getAppConfig = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};