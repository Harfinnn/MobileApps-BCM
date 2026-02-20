import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import NotificationSkeleton from '../skeleton/NotificationSkeleton';
import { X, BellOff } from 'lucide-react-native';

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  type: string;
  reference_id: number;
  created_at: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  data: NotificationItem[];
  loading: boolean;
  onRead: (id: number) => void;
  onReadAll: () => void;
  onDelete: (id: number) => void;
  onOpen: (item: NotificationItem) => void;
};

export default function NotificationMenu({
  visible,
  onClose,
  data,
  loading,
  onRead,
  onReadAll,
  onDelete,
  onOpen,
}: Props) {
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 20, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 150 });
    } else {
      scale.value = withTiming(0.95, { duration: 100 });
      opacity.value = withTiming(0, { duration: 100 });
    }
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View style={[styles.menu, animStyle]}>
        {/* HEADER MINI */}
        <View style={styles.headerRow}>
          <Text style={styles.menuTitle}>Notifikasi</Text>
          {data.some(n => !n.is_read) && (
            <Pressable onPress={onReadAll} hitSlop={10}>
              <Text style={styles.markAllText}>Baca Semua</Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          bounces={false}
          style={{ maxHeight: 320 }}
          showsVerticalScrollIndicator={false}
        >
          {loading && <NotificationSkeleton />}

          {!loading && data.length === 0 && (
            <View style={styles.empty}>
              <BellOff size={20} color="#CBD5E1" />
              <Text style={styles.emptyText}>Kosong</Text>
            </View>
          )}

          {!loading &&
            data.slice(0, 4).map(item => {
              const unread = !item.is_read;
              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.item,
                    unread && styles.unreadItem,
                    pressed && styles.pressedItem,
                  ]}
                  onPress={() => {
                    if (!item.is_read) {
                      onRead(item.id);
                    }
                    onOpen(item);
                  }}
                >
                  <View style={styles.row}>
                    {unread && <View style={styles.dot} />}
                    <View style={styles.content}>
                      <Text
                        style={[styles.itemTitle, unread && styles.unreadTitle]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.message} numberOfLines={1}>
                        {item.message}
                      </Text>
                    </View>
                    <Pressable
                      onPress={e => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      style={styles.deleteBtn}
                    >
                      <X size={20} color="#94A3B8" />
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
        </ScrollView>

        {data.length > 0 && (
          <Pressable style={styles.footerBtn} onPress={onClose}>
            <Text style={styles.footerText}>Tutup</Text>
          </Pressable>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 99,
  },
  menu: {
    position: 'absolute',
    top: 65,
    right: 15,
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      },
      android: {
        elevation: 8,
      },
    }),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  markAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48',
  },
  empty: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  item: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  unreadItem: {
    backgroundColor: '#FFF1F2',
  },
  pressedItem: {
    backgroundColor: '#F1F5F9',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E11D48',
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  unreadTitle: {
    fontWeight: '800',
    color: '#0F172A',
  },
  message: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 5,
  },
  footerBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
