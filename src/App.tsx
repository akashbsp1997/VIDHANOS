import { useEffect } from 'react';
import { Outlet } from 'react-router';

import { BottomNav } from '@/components/BottomNav';
import { settingsRepo } from '@/db/repositories/settingsRepo';
import { getNotificationPermission, startWhileOpenReminders, stopWhileOpenReminders } from '@/services/notifications';

export function App() {
  useEffect(() => {
    settingsRepo.getNotificationsEnabled().then((enabled) => {
      if (enabled && getNotificationPermission() === 'granted') {
        startWhileOpenReminders();
      }
    });
    return () => stopWhileOpenReminders();
  }, []);

  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}
