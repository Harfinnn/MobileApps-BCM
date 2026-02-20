import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DismissedNotif = {
  id: number;
  dismissedAt: number;
};

const getDismissKey = (userId: number) => `dismissed_notifications_${userId}`;

const EXPIRE_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

export function useDismissedNotifications(userId?: number) {
  const [dismissedIds, setDismissedIds] = useState<DismissedNotif[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      const key = getDismissKey(userId);
      const stored = await AsyncStorage.getItem(key);
      const parsed: DismissedNotif[] = stored ? JSON.parse(stored) : [];

      const now = Date.now();

      // 🔥 AUTO CLEAR > 7 HARI
      const cleaned = parsed.filter(d => now - d.dismissedAt <= EXPIRE_MS);

      // update storage kalau ada perubahan
      if (cleaned.length !== parsed.length) {
        await AsyncStorage.setItem(key, JSON.stringify(cleaned));
      }

      setDismissedIds(cleaned);
      setLoaded(true);
    };

    load();
  }, [userId]);

  const dismiss = (id: number) => {
    if (!userId) return;

    setDismissedIds(prev => {
      const updated = [...prev, { id, dismissedAt: Date.now() }];

      AsyncStorage.setItem(getDismissKey(userId), JSON.stringify(updated));

      return updated;
    });
  };

  return { dismissedIds, dismiss, loaded };
}
