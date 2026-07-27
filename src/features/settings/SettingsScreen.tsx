import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useFocusRefresh } from '@/hooks/useFocusRefresh';
import { exportBackup } from '@/services/backup';
import { getStorageUsageBytes } from '@/services/fileStorage';
import {
  deleteLocalModel,
  downloadLocalModel,
  getLocalModelSizeBytes,
  isLocalModelDownloaded,
} from '@/services/ai/localModel';
import { topUpScheduledReminders } from '@/services/notifications';
import { getGeminiApiKey, getIndianKanoonToken, setGeminiApiKey, setIndianKanoonToken } from '@/services/secureConfig';
import { colors } from '@/theme/colors';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SettingsScreen() {
  const { data: keys, reload: reloadKeys } = useFocusRefresh(async () => ({
    gemini: await getGeminiApiKey(),
    indianKanoon: await getIndianKanoonToken(),
  }));
  const { data: storage, reload: reloadStorage } = useFocusRefresh(async () => ({
    usedBytes: getStorageUsageBytes(),
    modelDownloaded: isLocalModelDownloaded(),
    modelBytes: getLocalModelSizeBytes(),
  }));

  const [geminiInput, setGeminiInput] = useState('');
  const [kanoonInput, setKanoonInput] = useState('');
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const onSaveGemini = async () => {
    await setGeminiApiKey(geminiInput.trim() || null);
    setGeminiInput('');
    reloadKeys();
  };

  const onSaveKanoon = async () => {
    await setIndianKanoonToken(kanoonInput.trim() || null);
    setKanoonInput('');
    reloadKeys();
  };

  const onDownloadModel = async () => {
    setDownloadProgress(0);
    try {
      await downloadLocalModel(undefined, setDownloadProgress);
      reloadStorage();
    } catch {
      Alert.alert('Download failed', 'Could not download the offline model. Check your connection and try again.');
    } finally {
      setDownloadProgress(null);
    }
  };

  const onDeleteModel = () => {
    Alert.alert('Delete offline model', 'AI guidance will only work online after this.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteLocalModel();
          reloadStorage();
        },
      },
    ]);
  };

  const onExportBackup = async () => {
    setBusy(true);
    try {
      await exportBackup();
    } catch {
      Alert.alert('Backup failed', 'Could not create the backup file.');
    } finally {
      setBusy(false);
    }
  };

  const onResyncReminders = async () => {
    setBusy(true);
    await topUpScheduledReminders();
    setBusy(false);
    Alert.alert('Reminders synced', 'Upcoming hearing/deadline reminders are up to date.');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="AI Guidance — Gemini (online)">
          <Text style={styles.hint}>
            {keys?.gemini ? 'A Gemini API key is set.' : 'No Gemini API key set. Get one from Google AI Studio.'}
          </Text>
          <TextField
            label="Gemini API key"
            value={geminiInput}
            onChangeText={setGeminiInput}
            placeholder={keys?.gemini ? '••••••••••••' : 'Paste your API key'}
            autoCapitalize="none"
            secureTextEntry
          />
          <View style={styles.row}>
            <Button label="Save" onPress={onSaveGemini} />
            {keys?.gemini ? (
              <Button label="Clear" variant="secondary" onPress={() => setGeminiApiKey(null).then(reloadKeys)} />
            ) : null}
          </View>
        </Section>

        <Section title="AI Guidance — Offline model">
          <Text style={styles.hint}>
            {storage?.modelDownloaded
              ? `Downloaded (${formatBytes(storage.modelBytes)}). Used automatically when offline.`
              : 'Not downloaded. Download once (large file, use Wi-Fi) to use AI guidance without internet.'}
          </Text>
          {downloadProgress !== null ? (
            <Text style={styles.hint}>Downloading… {(downloadProgress * 100).toFixed(0)}%</Text>
          ) : (
            <View style={styles.row}>
              {storage?.modelDownloaded ? (
                <Button label="Delete Model" variant="danger" onPress={onDeleteModel} />
              ) : (
                <Button label="Download Model" onPress={onDownloadModel} />
              )}
            </View>
          )}
        </Section>

        <Section title="Citations — Indian Kanoon">
          <Text style={styles.hint}>
            {keys?.indianKanoon ? 'A token is set.' : 'No API token set. Requires a paid Indian Kanoon account.'}
          </Text>
          <TextField
            label="Indian Kanoon API token"
            value={kanoonInput}
            onChangeText={setKanoonInput}
            placeholder={keys?.indianKanoon ? '••••••••••••' : 'Paste your API token'}
            autoCapitalize="none"
            secureTextEntry
          />
          <View style={styles.row}>
            <Button label="Save" onPress={onSaveKanoon} />
            {keys?.indianKanoon ? (
              <Button label="Clear" variant="secondary" onPress={() => setIndianKanoonToken(null).then(reloadKeys)} />
            ) : null}
          </View>
        </Section>

        <Section title="Storage & Backup">
          <Text style={styles.hint}>Case documents on this device: {storage ? formatBytes(storage.usedBytes) : '—'}</Text>
          <Text style={styles.hintSmall}>
            Everything is stored only on this device — there is no cloud sync. Export a backup regularly.
          </Text>
          <View style={styles.row}>
            <Button label="Export Backup" onPress={onExportBackup} loading={busy} />
          </View>
        </Section>

        <Section title="Reminders">
          <View style={styles.row}>
            <Button label="Re-sync Reminders" variant="secondary" onPress={onResyncReminders} loading={busy} />
          </View>
        </Section>
      </ScrollView>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 8,
  },
  hintSmall: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
