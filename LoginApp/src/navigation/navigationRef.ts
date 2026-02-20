import {
  createNavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

let pendingNotificationData: any = null;
export let openedFromNotification = false;

/**
 * Navigate langsung (normal)
 */
export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    pendingNotificationData = {
      type: 'direct',
      name,
      params,
    };
  }
}

/**
 * Simpan data notif saat cold start / background click
 */
export function markOpenedFromNotification(data?: any) {
  openedFromNotification = true;

  pendingNotificationData = {
    type: 'notification',
    data,
  };
}

/**
 * Eksekusi navigation yang tertunda
 */
export function flushPendingNavigation() {
  if (!pendingNotificationData || !navigationRef.isReady()) return;

  const payload = pendingNotificationData;

  // Clear dulu supaya tidak double eksekusi
  pendingNotificationData = null;
  openedFromNotification = false;

  // 🔹 Direct navigate biasa
  if (payload.type === 'direct') {
    navigationRef.navigate(payload.name, payload.params);
    return;
  }

  // 🔹 Dari notifikasi (FIX UTAMA DI SINI)
  if (payload.type === 'notification') {
    const data = payload.data;

    if (!data?.type) return;

    switch (data.type) {
      case 'bencana':
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
                params: {
                  screen: 'DetailBencana',
                  params: { id: Number(data.lapor_id) },
                },
              },
            ],
          }),
        );
        break;

      case 'announcement':
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
                params: {
                  screen: 'DashboardBencana',
                },
              },
            ],
          }),
        );
        break;

      default:
        console.log('Unknown notification type:', data.type);
    }
  }
}