import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-reanimated';
import AppNavigator from './src/navigation/AppNavigator';
import { LayoutProvider } from './src/contexts/LayoutContext';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <LayoutProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <Toast />
    </LayoutProvider>
  );
};

export default App;
