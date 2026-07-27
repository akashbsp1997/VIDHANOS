import { hearingsRepo } from '@/db/repositories/hearingsRepo';

/**
 * Best-effort only: fires a Notification for hearings/deadlines that just became due, but
 * only while this tab is open. Browsers have no reliable "alarm even when closed" API without
 * a push server, which this app intentionally doesn't have. The Dashboard's Overdue/Today
 * section is the mechanism that's always correct.
 */
const CHECK_INTERVAL_MS = 60_000;
const notifiedHearingIds = new Set<string>();
let intervalId: ReturnType<typeof setInterval> | null = null;

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  return Notification.requestPermission();
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

async function checkDueHearings(): Promise<void> {
  if (Notification.permission !== 'granted') return;

  const now = Date.now();
  const upcoming = await hearingsRepo.listUpcoming(100);

  for (const hearing of upcoming) {
    const dueAt = hearing.hearingDate - hearing.reminderOffsetMinutes * 60_000;
    if (dueAt <= now && !notifiedHearingIds.has(hearing.id)) {
      notifiedHearingIds.add(hearing.id);
      new Notification(hearing.isDeadline ? 'Upcoming deadline' : 'Upcoming hearing', {
        body: hearing.purpose || (hearing.isDeadline ? 'Filing deadline' : 'Court hearing'),
        tag: hearing.id,
      });
    }
  }
}

export function startWhileOpenReminders(): void {
  if (intervalId) return;
  checkDueHearings();
  intervalId = setInterval(checkDueHearings, CHECK_INTERVAL_MS);
}

export function stopWhileOpenReminders(): void {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
}
