import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import { resolveImageUri } from '../../../utils/image';

import ProfileMenu from '../../menu/ProfileMenu';
import NotificationMenu from '../../menu/NotificationMenu';
import SearchResultOverlay from '../SearchResultOverlay';
import { HeaderSearch } from './HeaderSearch';
import { HeaderActions } from './HeaderActions';

import { useDismissedNotifications } from '../../../hooks/useDismissedNotifications';
import { useHeaderNotifications } from './useHeaderNotifications';
import { getUnreadCount } from '../../../utils/notifications';

import { styles } from '../../../styles/navigation/headerStyle';
import { SEARCH_ROUTES } from '../../../constants/searchRoutes';
import API from '../../../services/api';

import notifee from '@notifee/react-native';
import { setNotificationListener } from '../../../services/fcmHandler';

export default function DashboardHeader({ onLogoutPress }: any) {
  const navigation = useNavigation<any>();
  const { showBack, onBack, showSearch, hideHeaderLeft } = useLayout();
  const { user } = useUser();

  /* ================= FORCE LOGIN ================= */
  useEffect(() => {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [user, navigation]);

  /* ================= STATE ================= */
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [search, setSearch] = useState('');

  /* ================= USER DATA ================= */
  const userName = user?.user_nama ?? '';

  const avatarUri = useMemo(
    () => (user ? resolveImageUri(user.user_foto) : null),
    [user],
  );

  const initial = useMemo(() => {
    if (!userName || userName.trim().length === 0) {
      return 'U'; // fallback aman
    }

    const parts = userName.trim().split(' ').filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  }, [userName]);

  /* ================= NOTIFICATIONS ================= */
  const { dismissedIds, dismiss, loaded } = useDismissedNotifications(
    user?.user_id,
  );

  const {
    notifications,
    loading: loadingNotif,
    setNotifications,
    fetchNotifications,
  } = useHeaderNotifications(dismissedIds, loaded);

  const unreadCount = useMemo(
    () => getUnreadCount(notifications),
    [notifications],
  );

  useEffect(() => {
    notifee.setBadgeCount(unreadCount);
  }, [unreadCount]);

  useEffect(() => {
    setNotificationListener(() => {
      fetchNotifications(true);
    });
  }, [fetchNotifications]);

  /* ================= HANDLERS ================= */
  const handleBack = useCallback(() => {
    if (onBack) return onBack();
    if (navigation.canGoBack()) return navigation.goBack();
    navigation.navigate('Main', { screen: 'Home' });
  }, [onBack, navigation]);

  const closeSearch = () => {
    setSearch('');
    setSearchMode(false);
  };

  const markAsRead = async (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n)),
    );

    try {
      await API.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.log('Gagal mark notif read', err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    try {
      await API.patch('/notifications/read-all');
    } catch (err) {
      console.log('Gagal mark all read', err);
    }
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    dismiss(id);
  };

  /* ================= SEARCH ================= */
  const results = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return [];
    return SEARCH_ROUTES.filter(item =>
      item.label.toLowerCase().includes(keyword),
    );
  }, [search]);

  /* ================= RENDER ================= */
  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          {/* LEFT */}
          <View
            style={[
              styles.pill,
              hideHeaderLeft
                ? styles.pillHidden
                : showBack
                ? styles.pillBack
                : searchMode
                ? styles.pillSearch
                : styles.pillNormal,
            ]}
          >
            {hideHeaderLeft ? null : showBack ? (
              <TouchableOpacity
                style={styles.backButtonWrapper}
                onPress={handleBack}
              >
                <ArrowLeft size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ) : searchMode ? (
              <HeaderSearch
                value={search}
                onChange={setSearch}
                onClose={closeSearch}
              />
            ) : (
              <View>
                <Text style={styles.greetingSmall}>Welcome</Text>
                <Text style={styles.greetingName}>{userName}</Text>
              </View>
            )}
          </View>

          {/* RIGHT */}
          <HeaderActions
            hideSearch={!showSearch}
            unread={unreadCount}
            avatarUri={avatarUri}
            initial={initial}
            onSearch={() => {
              setSearchMode(true);
              setShowMenu(false);
              setShowNotif(false);
            }}
            onNotif={() => {
              setShowNotif(prev => !prev);
              setShowMenu(false);
              setSearchMode(false);
            }}
            onProfile={() => {
              setShowMenu(prev => !prev);
              setShowNotif(false);
            }}
          />
        </View>
      </View>

      <SearchResultOverlay
        visible={searchMode}
        keyword={search}
        results={results}
        onClose={closeSearch}
      />

      <ProfileMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onLogout={onLogoutPress ?? (() => {})}
      />

      <NotificationMenu
        visible={showNotif}
        onClose={() => setShowNotif(false)}
        data={notifications}
        loading={loadingNotif}
        onRead={markAsRead}
        onReadAll={markAllAsRead}
        onDelete={deleteNotification}
        onOpen={item => {
          setShowNotif(false);

          switch (item.type) {
            case 'bencana':
              navigation.navigate('Main', {
                screen: 'DetailBencana',
                params: { id: item.reference_id },
              });
              break;

            default:
              console.warn('Unknown notification type', item);
          }
        }}
      />
    </>
  );
}
