let logoutHandler: (() => Promise<void>) | null = null;

export function setLogoutHandler(handler: () => Promise<void>) {
  logoutHandler = handler;
}

export async function triggerLogout() {
  if (logoutHandler) {
    await logoutHandler();
  }
}