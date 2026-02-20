/* ================= TYPES ================= */
export type NotificationItem = {
  id: number;
  title?: string;
  message?: string;
  is_read: boolean;
  created_at?: string;
  type?: string;
  reference_id?: number;
};

/* ================= FILTER ================= */
export function filterDismissed(
  notifications: NotificationItem[],
  dismissedIds: { id: number }[],
) {
  return notifications.filter(n => !dismissedIds.some(d => d.id === n.id));
}

/* ================= UNREAD COUNT ================= */
export function getUnreadCount(notifications: NotificationItem[]): number {
  return notifications.filter(n => !n.is_read).length;
}

/* ================= BADGE TEXT ================= */
export function formatBadgeCount(count: number): string {
  if (count <= 0) return '';
  if (count > 99) return '99+';
  return String(count);
}

/* ================= SORT (NEWEST FIRST) ================= */
export function sortByNewest(notifications: NotificationItem[]) {
  return [...notifications].sort((a, b) => {
    const aTime = new Date(a.created_at ?? 0).getTime();
    const bTime = new Date(b.created_at ?? 0).getTime();
    return bTime - aTime;
  });
}

/* ================= ROUTING (OPTIONAL) ================= */
export function getNotificationRoute(notification: NotificationItem) {
  if (!notification.type) return null;

  switch (notification.type) {
    case 'bencana':
      if (!notification.reference_id) return null;

      return {
        name: 'DetailBencana',
        params: { id: notification.reference_id },
      };

    default:
      return null;
  }
}
