import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
        <MainStack.Screen name="F3d" component={F3dScreen} />
        <MainStack.Screen name="Maps" component={MapScreen} />

        <MainStack.Screen name="Profile" component={ProfileScreen} />
        <MainStack.Screen name="EditProfile" component={EditProfileScreen} />

        <MainStack.Screen name="About" component={AboutScreen} />

        <MainStack.Screen name="DashboardIT" component={DashboardITScreen} />
        <MainStack.Screen name="DashboardNonIT" component={DashboardNonITScreen} />
        
        <MainStack.Screen name="LaporBencana" component={LaporBencanaScreen} />
        
        <MainStack.Screen name="InfoGempaBumi" component={InfoGempaBumiScreen} />
        <MainStack.Screen name="GempaDetail" component={GempaDetailScreen} />

        <MainStack.Screen name="RTA" component={RTAScreen} />
        <MainStack.Screen name="Audit" component={AuditScreen} />

        <MainStack.Screen name="PanduanBencana" component={PanduanBencanaScreen} />
        <MainStack.Screen name="PanduanDetailScreen" component={PanduanDetailScreen} />

        <MainStack.Screen name="Berita" component={NewsScreen} />
        <MainStack.Screen name="DetailBerita" component={NewsDetailScreen} />

        <MainStack.Screen name="DashboardBencana" component={DashboardBencanaScreen} />
        <MainStack.Screen name="DetailBencana" component={DetailBencanaScreen} />

        <MainStack.Screen name="PanggilanDarurat" component={EmergencyCallScreen} />
        
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
        <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen name="Main" component={MainStackScreen} />
      </RootStack.Navigator>
    </LayoutProvider>
  );
}
