import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { hearingRepository } from '@/db/repositories/hearingRepository';
import type { Hearing } from '@/types/db';

const DEADLINES_CHANNEL_ID = 'deadlines';

/** iOS caps an app at 64 pending local notifications; stay comfortably under it. */
const MAX_SCHEDULED_REMINDERS = 60;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function initNotifications(): Promise<void> {
  await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(DEADLINES_CHANNEL_ID, {
      name: 'Hearings & Deadlines',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

export async function scheduleHearingReminder(hearing: Hearing): Promise<void> {
  if (hearing.notificationId) {
    await cancelHearingReminder(hearing.notificationId);
  }

  const fireAt = hearing.hearingDate - hearing.reminderOffsetMinutes * 60 * 1000;
  if (fireAt <= Date.now()) {
    await hearingRepository.setNotificationId(hearing.id, null);
    return;
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: hearing.isDeadline ? 'Upcoming deadline' : 'Upcoming hearing',
      body: hearing.purpose || (hearing.isDeadline ? 'Filing deadline' : 'Court hearing'),
      data: { hearingId: hearing.id, caseId: hearing.caseId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(fireAt),
      channelId: DEADLINES_CHANNEL_ID,
    },
  });

  await hearingRepository.setNotificationId(hearing.id, id);
}

export async function cancelHearingReminder(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId).catch(() => undefined);
}

/**
 * Keeps only the nearest upcoming hearings/deadlines scheduled, so we never approach the
 * OS's pending-notification cap. Call on app foreground and after any hearing CRUD.
 */
export async function topUpScheduledReminders(): Promise<void> {
  const upcoming = await hearingRepository.listUpcoming(MAX_SCHEDULED_REMINDERS);
  for (const hearing of upcoming) {
    if (!hearing.notificationId) {
      await scheduleHearingReminder(hearing);
    }
  }
}
