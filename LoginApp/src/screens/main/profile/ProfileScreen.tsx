import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  User,
  Settings,
  Lock,
  Info,
  ChevronRight,
  LogOut,
  HelpCircle,
} from 'lucide-react-native';

import ConfirmLogoutModal from '../../../components/modal/ConfirmLogoutModal';
import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import { resolveImageUri } from '../../../utils/image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '../../../components/common/Avatar';
import { styles } from '../../../styles/profile/profileStyle';

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

function MenuItem({ icon, label, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconBg}>{icon}</View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <ChevronRight size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );
}

type VerifyPasswordModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void | Promise<void>;
};

function VerifyPasswordModal({
  visible,
  onClose,
  onSubmit,
}: VerifyPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(password);
    } finally {
      setSubmitting(false);
      setPassword('');
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.verifyOverlay}>
        <View style={styles.verifyCard}>
          <Text style={styles.verifyTitle}>Verifikasi Password</Text>

          <TextInput
            secureTextEntry
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            style={styles.verifyInput}
            autoFocus
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || password.length === 0}
            style={[
              styles.verifySubmitBtn,
              (submitting || password.length === 0) && { opacity: 0.6 },
            ]}
          >
            <Text style={styles.verifySubmitText}>
              {submitting ? 'Memeriksa...' : 'Verifikasi'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClose}
            style={styles.verifyCancelBtn}
          >
            <Text style={styles.verifyCancelText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();

  const { user, loading, setUser } = useUser();

  const [showLogout, setShowLogout] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const isAdmin = Number(user?.user_jabatan) === 1;
  const HARDCODE_PASSWORD = 'admin123';

  const goHome = useCallback(() => {
    navigation.navigate('Main', { screen: 'Home' });
    return true;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setTitle('Profile');
      setHideNavbar(true);
      setShowBack(true);
      setShowSearch(false);
      setOnBack(() => goHome);

      const sub = BackHandler.addEventListener('hardwareBackPress', goHome);

      return () => {
        setOnBack(undefined);
        sub.remove();
      };
    }, [
      goHome,
      setHideNavbar,
      setOnBack,
      setShowBack,
      setShowSearch,
      setTitle,
    ]),
  );

  const avatarUri = useMemo(
    () => resolveImageUri(user?.user_foto),
    [user?.user_foto],
  );

  const initial = useMemo(
    () => user?.user_nama?.charAt(0).toUpperCase() ?? '',
    [user],
  );

  if (loading || !user) {
    return (
      <LinearGradient
        colors={['#009B97', '#007A77']}
        style={styles.container}
      />
    );
  }

  const handleLogout = () => setShowLogout(true);

  const confirmLogout = async () => {
    setShowLogout(false);
    await setUser(null);
  };

  const handleOpenAbout = () => {
    setPendingRoute('EditAbout');
    setShowVerifyModal(true);
  };

  const handleVerifyPassword = async (password: string) => {
    if (password === HARDCODE_PASSWORD) {
      setShowVerifyModal(false);
      if (pendingRoute) {
        navigation.navigate(pendingRoute);
        setPendingRoute(null);
      }
    } else {
      Alert.alert('Gagal', 'Password salah');
    }
  };

  return (
    <>
      <LinearGradient
        colors={['#009B97', '#007A77']}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={[styles.header, { paddingTop: insets.top + 70 }]}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGlow}>
              <Avatar uri={avatarUri} initial={initial} size={96} />
            </View>

            <Text style={styles.name}>{user.user_nama}</Text>

            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user.jabatan?.jab_nama ?? 'Viewer'}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>AKUN & INFORMASI</Text>

          <MenuItem
            icon={<User size={18} color="#009B97" />}
            label="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />

          {isAdmin && (
            <MenuItem
              icon={<Settings size={18} color="#009B97" />}
              label="Pengaturan Info Aplikasi"
              onPress={handleOpenAbout}
            />
          )}

          <Text style={styles.sectionLabel}>PRIVASI & KEAMANAN</Text>

          <MenuItem
            icon={<Lock size={18} color="#009B97" />}
            label="Ganti Password"
            onPress={() =>
              navigation.navigate('ChangePassword', {
                user_id: user.user_id,
                fromProfile: true,
              })
            }
          />

          <MenuItem
            icon={<Info size={18} color="#009B97" />}
            label="Tentang"
            onPress={() => navigation.navigate('About')}
          />

          <MenuItem
            icon={<HelpCircle size={18} color="#009B97" />}
            label="Bantuan / FAQ"
            onPress={() => navigation.navigate('Bantuan')}
          />

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color="#EF4444" />
            <Text style={styles.logoutText}>Keluar Akun</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>

      <ConfirmLogoutModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={confirmLogout}
      />

      <VerifyPasswordModal
        visible={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onSubmit={handleVerifyPassword}
      />
    </>
  );
}
