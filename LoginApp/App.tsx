import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AppNavigator from './src/navigation/AppNavigator';
import { LayoutProvider } from './src/contexts/LayoutContext';
import Toast from 'react-native-toast-message';
import { UserProvider } from './src/contexts/UserContext';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <UserProvider>
          <LayoutProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
            <Toast />
          </LayoutProvider>
        </UserProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
