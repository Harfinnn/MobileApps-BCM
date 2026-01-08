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
import DashboardITScreen from '../screens/main/DashboardITScreen';
import DashboardNonITScreen from '../screens/main/DashboardNonITScreen';
import LaporBencanaScreen from '../screens/main/LaporBencanaScreen';

const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

function MainStackScreen() {
  return (
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
        <MainStack.Screen name="DashboardIT" component={DashboardITScreen} />
        <MainStack.Screen name="DashboardNonIT" component={DashboardNonITScreen} />
        <MainStack.Screen name="LaporBencana" component={LaporBencanaScreen} />
      </MainStack.Navigator>
    </MainLayout>
  );
}

export default function AppNavigator() {
  return (
    <LayoutProvider>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Loading" component={LoadingScreen} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen name="Main" component={MainStackScreen} />
      </RootStack.Navigator>
    </LayoutProvider>
  );
}
