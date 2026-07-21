import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/main/home/HomeScreen';
import FileScreen from '../screens/main/FileScreen';
import MapScreen from '../screens/main/map/MapScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileScreen from '../screens/main/profile/ProfileScreen';
import EditProfileScreen from '../screens/main/profile/EditProfileScreen';
import MainLayout from '../layouts/MainLayout';
import { LayoutProvider } from '../contexts/LayoutContext';
import DashboardITScreen from '../screens/main/dashboard/DashboardITScreen';
import DashboardNonITScreen from '../screens/main/dashboard/DashboardNonITScreen';
import LaporBencanaScreen from '../screens/main/bencana/LaporBencanaScreen';
import InfoGempaBumiScreen from '../screens/main/gempa/InfoGempaBumiScreen';
import AuditScreen from '../screens/main/AuditScreen';
import PanduanBencanaScreen from '../screens/main/panduan/PanduanBencana';
import NewsScreen from '../screens/main/news/NewsScreen';
import RTAScreen from '../screens/main/utility/RTAScreen';
import AboutScreen from '../screens/main/about/AboutScreen';
import NewsDetailScreen from '../screens/main/news/NewsDetailScreen';
import PanduanDetailScreen from '../screens/main/panduan/PanduanDetailScreen';
import DashboardBencanaScreen from '../screens/main/dashboard/DashboardBencanaScreen';
import DetailBencanaScreen from '../screens/main/dashboard/DetailBencanaScreen';
import EmergencyCallScreen from '../screens/main/emergency/EmergencyCallScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import GempaDetailScreen from '../screens/main/gempa/GempaDetailScreen';
import F3dScreen from '../screens/main/forecast/F3dScreen';
import EditAboutScreen from '../screens/main/profile/EditAboutScreen';
import { useUser } from '../contexts/UserContext';
import ChangePasswordFirstScreen from '../screens/auth/ChangePasswordFirstScreen';
import LaporGempaScreen from '../screens/main/bencana/LaporGempaScreen';
import BookScreen from '../screens/main/playbook/BookScreen';
import BookViewScreen from '../screens/main/playbook/BookViewScreen';
import ChatBetaScreen from '../screens/main/ChatBetaScreen';
import TsunamiHistoryScreen from '../screens/main/gempa/TsunamiHistoryScreen';
import TsunamiDetailScreen from '../screens/main/gempa/TsunamiDetailScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import BantuanScreen from '../screens/main/emergency/BantuanScreen';

const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

function MainStackScreen() {
  const { user } = useUser();

  return (
    <MainLayout key={user?.user_id}>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
          detachInactiveScreens: false,
          animation: 'fade',
        }}
      >
        <MainStack.Screen name="Home" component={HomeScreen} />
        <MainStack.Screen name="File" component={FileScreen} />
        <MainStack.Screen name="F3d" component={F3dScreen} />
        <MainStack.Screen name="Maps" component={MapScreen} />
        <MainStack.Screen name="Book" component={BookScreen} />

        <RootStack.Screen
          name="ChangePassword"
          component={ChangePasswordFirstScreen}
        />

        <MainStack.Screen name="Profile" component={ProfileScreen} />
        <MainStack.Screen name="EditProfile" component={EditProfileScreen} />

        <MainStack.Screen name="About" component={AboutScreen} />
        <MainStack.Screen name="EditAbout" component={EditAboutScreen} />

        <MainStack.Screen name="DashboardIT" component={DashboardITScreen} />
        <MainStack.Screen
          name="DashboardNonIT"
          component={DashboardNonITScreen}
        />

        <MainStack.Screen name="LaporBencana" component={LaporBencanaScreen} />
        <MainStack.Screen name="LaporGempa" component={LaporGempaScreen} />

        <MainStack.Screen
          name="InfoGempaBumi"
          component={InfoGempaBumiScreen}
        />
        <MainStack.Screen name="GempaDetail" component={GempaDetailScreen} />

        <MainStack.Screen name="RTA" component={RTAScreen} />
        <MainStack.Screen name="Audit" component={AuditScreen} />
        <MainStack.Screen name="BookView" component={BookViewScreen} />

        <MainStack.Screen
          name="PanduanBencana"
          component={PanduanBencanaScreen}
        />
        <MainStack.Screen
          name="PanduanDetailScreen"
          component={PanduanDetailScreen}
        />

        <MainStack.Screen name="Berita" component={NewsScreen} />
        <MainStack.Screen name="DetailBerita" component={NewsDetailScreen} />

        <MainStack.Screen
          name="DashboardBencana"
          component={DashboardBencanaScreen}
        />
        <MainStack.Screen
          name="DetailBencana"
          component={DetailBencanaScreen}
        />

        <MainStack.Screen
          name="PanggilanDarurat"
          component={EmergencyCallScreen}
        />

        <MainStack.Screen
          name="Bantuan"
          component={BantuanScreen}
        />  

        <MainStack.Screen name="ChatBeta" component={ChatBetaScreen} />

        <MainStack.Screen
          name="TsunamiHistory"
          component={TsunamiHistoryScreen}
        />
        <MainStack.Screen
          name="TsunamiDetail"
          component={TsunamiDetailScreen}
        />
      </MainStack.Navigator>
    </MainLayout>
  );
}

export default function AppNavigator() {
  const { user, loading } = useUser();
  const [ready, setReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.log('Error checking first launch:', error);
        setIsFirstLaunch(false);
      }
    }
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (!loading && isFirstLaunch !== null) {
      const timer = setTimeout(() => {
        setReady(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loading, isFirstLaunch]);

  if (loading || !ready || isFirstLaunch === null) {
    return <LoadingScreen />;
  }

  return (
    <LayoutProvider>
      <RootStack.Navigator
        key={user ? 'app' : 'auth'}
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          <RootStack.Screen name="Main" component={MainStackScreen} />
        ) : (
          <>
            {isFirstLaunch && (
              <RootStack.Screen
                name="Onboarding"
                component={OnboardingScreen}
              />
            )}
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <RootStack.Screen
              name="ChangePasswordFirst"
              component={ChangePasswordFirstScreen}
            />
            <RootStack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </RootStack.Navigator>
    </LayoutProvider>
  );
}
