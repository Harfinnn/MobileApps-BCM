import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Bell, Search } from 'lucide-react-native';
import Avatar from '../../common/Avatar';
import { styles } from '../../../styles/navigation/headerStyle';

type Props = {
  unread: number;
  onSearch: () => void;
  onNotif: () => void;
  onProfile: () => void;
  avatarUri?: string | null;
  initial: string;
  hideSearch?: boolean;
};

export function HeaderActions({
  unread,
  onSearch,
  onNotif,
  onProfile,
  avatarUri,
  initial,
  hideSearch = false,
}: Props) {
  return (
    <View style={styles.rightActions}>
      
      {/* 🔍 SEARCH */}
      {!hideSearch && (
        <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
          <Search size={24} color="#F8AD3CFF" />
        </TouchableOpacity>
      )}

      {/* 🔔 NOTIF */}
      <TouchableOpacity style={styles.bellWrapper} onPress={onNotif}>
        <Bell size={24} color="#F8AD3CFF" />
        {unread > 0 && (
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>
              {unread > 99 ? '99+' : unread}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 👤 PROFILE */}
      <TouchableOpacity style={styles.iconBtn} onPress={onProfile}>
        <Avatar uri={avatarUri} initial={initial} size={40} />
      </TouchableOpacity>
    </View>
  );
}
