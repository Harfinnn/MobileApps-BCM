import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import API from '../../../services/api';
import { filterDismissed, sortByNewest } from '../../../utils/notifications';

export function useHeaderNotifications(
  dismissedIds: { id: number }[],
  enabled: boolean,
) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setLoading(true);

        const res = await API.get('/notifications');

        if (res.data.success) {

          const filtered = filterDismissed(res.data.data, dismissedIds);
          setNotifications(prev => {
            const sorted = sortByNewest(filtered);

            const merged = sorted.map(newItem => {
              const existing = prev.find(p => p.id === newItem.id);

              if (!existing) return newItem;

              // 🔥 PERTAHANKAN READ STATUS LOKAL
              return {
                ...newItem,
                is_read: existing.is_read,
              };
            });

            return merged;
          });
        }
      } catch (err) {
        console.log('Gagal ambil notifikasi', err);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [dismissedIds],
  );

  useEffect(() => {
    if (!enabled) return;

    fetchNotifications(false);

    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        fetchNotifications(false);
      }
    });

    return () => {
      sub.remove();
    };
  }, [fetchNotifications, enabled]);

  return {
    notifications,
    loading,
    setNotifications,
    fetchNotifications,
  };
}
