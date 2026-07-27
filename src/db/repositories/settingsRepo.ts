import { db } from '../schema';

const GEMINI_API_KEY = 'geminiApiKey';
const INDIAN_KANOON_API_TOKEN = 'indianKanoonApiToken';
const NOTIFICATIONS_ENABLED = 'notificationsEnabled';

async function getValue(key: string): Promise<string | null> {
  const entry = await db.settings.get(key);
  return entry?.value ?? null;
}

async function setValue(key: string, value: string | null): Promise<void> {
  if (value === null) {
    await db.settings.delete(key);
    return;
  }
  await db.settings.put({ key, value });
}

export const settingsRepo = {
  getGeminiApiKey: () => getValue(GEMINI_API_KEY),
  setGeminiApiKey: (value: string | null) => setValue(GEMINI_API_KEY, value),

  getIndianKanoonToken: () => getValue(INDIAN_KANOON_API_TOKEN),
  setIndianKanoonToken: (value: string | null) => setValue(INDIAN_KANOON_API_TOKEN, value),

  async getNotificationsEnabled(): Promise<boolean> {
    return (await getValue(NOTIFICATIONS_ENABLED)) === 'true';
  },
  setNotificationsEnabled: (value: boolean) => setValue(NOTIFICATIONS_ENABLED, value ? 'true' : 'false'),
};
