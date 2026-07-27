import * as SecureStore from 'expo-secure-store';

const GEMINI_API_KEY = 'gemini_api_key';
const INDIAN_KANOON_API_TOKEN = 'indiankanoon_api_token';

export async function getGeminiApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(GEMINI_API_KEY);
}

export async function setGeminiApiKey(value: string | null): Promise<void> {
  if (!value) {
    await SecureStore.deleteItemAsync(GEMINI_API_KEY);
    return;
  }
  await SecureStore.setItemAsync(GEMINI_API_KEY, value);
}

export async function getIndianKanoonToken(): Promise<string | null> {
  return SecureStore.getItemAsync(INDIAN_KANOON_API_TOKEN);
}

export async function setIndianKanoonToken(value: string | null): Promise<void> {
  if (!value) {
    await SecureStore.deleteItemAsync(INDIAN_KANOON_API_TOKEN);
    return;
  }
  await SecureStore.setItemAsync(INDIAN_KANOON_API_TOKEN, value);
}
