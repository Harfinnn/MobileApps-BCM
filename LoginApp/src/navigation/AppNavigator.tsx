import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/main/HomeScreen';
import FileScreen from '../screens/main/FileScreen';
import FavScreen from '../screens/main/FavScreen';
import MapScreen from '../screens/main/MapScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import MainLayout from '../layouts/MainLayout';
import { LayoutProvider } from '../contexts/LayoutContext';

const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

function MainStackScreen() {
  return (
    <LayoutProvider>
      <MainLayout>
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
            detachInactiveScreens: false,
            animation: 'fade',
          }}
        >
          <MainStack.Screen name="Home" component={HomeScreen} />
          <MainStack.Screen name="File" component={FileScreen} />
          <MainStack.Screen name="Favs" component={FavScreen} />
          <MainStack.Screen name="Maps" component={MapScreen} />
          <MainStack.Screen name="Profile" component={ProfileScreen} />
          <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
        </MainStack.Navigator>
      </MainLayout>
    </LayoutProvider>
  );
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Loading" component={LoadingScreen} />
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
      <RootStack.Screen name="Main" component={MainStackScreen} />
    </RootStack.Navigator>
  );
}
