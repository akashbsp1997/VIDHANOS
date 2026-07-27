import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { settingsRepo } from '@/db/repositories/settingsRepo';
import {
  exportBackup,
  getStorageEstimate,
  importBackup,
  isStoragePersisted,
  requestPersistentStorage,
} from '@/services/backup';
import {
  getNotificationPermission,
  requestNotificationPermission,
  startWhileOpenReminders,
  stopWhileOpenReminders,
} from '@/services/notifications';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SettingsScreen() {
  const [geminiKey, setGeminiKey] = useState<string | null>(null);
  const [geminiInput, setGeminiInput] = useState('');
  const [kanoonToken, setKanoonToken] = useState<string | null>(null);
  const [kanoonInput, setKanoonInput] = useState('');
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [storage, setStorage] = useState<{ usageBytes: number; quotaBytes: number } | null>(null);
  const [persisted, setPersisted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const reload = async () => {
    setGeminiKey(await settingsRepo.getGeminiApiKey());
    setKanoonToken(await settingsRepo.getIndianKanoonToken());
    setNotifPermission(getNotificationPermission());
    setNotifEnabled(await settingsRepo.getNotificationsEnabled());
    setStorage(await getStorageEstimate());
    setPersisted(await isStoragePersisted());
  };

  useEffect(() => {
    reload();
  }, []);

  const onSaveGemini = async () => {
    await settingsRepo.setGeminiApiKey(geminiInput.trim() || null);
    setGeminiInput('');
    reload();
  };

  const onSaveKanoon = async () => {
    await settingsRepo.setIndianKanoonToken(kanoonInput.trim() || null);
    setKanoonInput('');
    reload();
  };

  const onToggleNotifications = async () => {
    if (!notifEnabled) {
      const permission = await requestNotificationPermission();
      setNotifPermission(permission);
      if (permission === 'granted') {
        await settingsRepo.setNotificationsEnabled(true);
        startWhileOpenReminders();
        setNotifEnabled(true);
      }
    } else {
      stopWhileOpenReminders();
      await settingsRepo.setNotificationsEnabled(false);
      setNotifEnabled(false);
    }
  };

  const onPersist = async () => {
    const granted = await requestPersistentStorage();
    setPersisted(granted);
  };

  const onExport = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await exportBackup();
      setMessage('Backup downloaded.');
    } catch {
      setMessage('Backup failed.');
    } finally {
      setBusy(false);
    }
  };

  const onImportFile = async (file: File | undefined) => {
    if (!file) return;
    if (!confirm('Import this backup? Existing records with the same ID will be overwritten.')) return;
    setBusy(true);
    setMessage(null);
    try {
      await importBackup(file);
      setMessage('Backup imported.');
      reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Import failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <div className="screen-header">
        <div className="section">
          <p className="section-title">AI Guidance — Gemini</p>
          <p style={{ fontSize: 12, marginBottom: 8 }}>
            {geminiKey ? 'A Gemini API key is set.' : 'No Gemini API key set. Get one from Google AI Studio.'}
          </p>
          <TextField
            label="Gemini API key"
            type="password"
            value={geminiInput}
            onChange={(e) => setGeminiInput(e.target.value)}
            placeholder={geminiKey ? '••••••••••••' : 'Paste your API key'}
          />
          <div className="btn-row">
            <Button label="Save" onClick={onSaveGemini} />
            {geminiKey ? (
              <Button label="Clear" variant="secondary" onClick={() => settingsRepo.setGeminiApiKey(null).then(reload)} />
            ) : null}
          </div>
        </div>

        <div className="section">
          <p className="section-title">Citations — Indian Kanoon</p>
          <p style={{ fontSize: 12, marginBottom: 8 }}>
            {kanoonToken ? 'A token is set.' : 'No API token set. Requires a paid Indian Kanoon account.'}
          </p>
          <TextField
            label="Indian Kanoon API token"
            type="password"
            value={kanoonInput}
            onChange={(e) => setKanoonInput(e.target.value)}
            placeholder={kanoonToken ? '••••••••••••' : 'Paste your API token'}
          />
          <div className="btn-row">
            <Button label="Save" onClick={onSaveKanoon} />
            {kanoonToken ? (
              <Button label="Clear" variant="secondary" onClick={() => settingsRepo.setIndianKanoonToken(null).then(reload)} />
            ) : null}
          </div>
        </div>

        <div className="section">
          <p className="section-title">Reminders</p>
          <p style={{ fontSize: 12, marginBottom: 8 }}>
            {notifPermission === 'unsupported'
              ? 'Notifications are not supported in this browser.'
              : 'Best effort only — fires while this app is open, not a guaranteed alarm if closed. The Dashboard\'s Overdue/Today section is always accurate regardless.'}
          </p>
          {notifPermission !== 'unsupported' ? (
            <Button
              label={notifEnabled ? 'Disable while-open alerts' : 'Enable while-open alerts'}
              variant={notifEnabled ? 'secondary' : 'primary'}
              onClick={onToggleNotifications}
            />
          ) : null}
        </div>

        <div className="section">
          <p className="section-title">Storage & Backup</p>
          <p style={{ fontSize: 12, marginBottom: 4 }}>
            Used: {storage ? formatBytes(storage.usageBytes) : '—'}
            {storage?.quotaBytes ? ` of ${formatBytes(storage.quotaBytes)} available` : ''}
          </p>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>
            Everything is stored only in this browser — there is no cloud sync, and storage can be evicted under
            pressure (especially in Safari). Export a backup regularly.
          </p>
          {!persisted ? (
            <Button label="Request persistent storage" variant="secondary" onClick={onPersist} />
          ) : (
            <p style={{ fontSize: 12, color: 'var(--color-success)' }}>Persistent storage granted.</p>
          )}
          <div className="btn-row" style={{ marginTop: 8 }}>
            <Button label="Export Backup" onClick={onExport} loading={busy} />
            <Button label="Import Backup" variant="secondary" onClick={() => importInputRef.current?.click()} disabled={busy} />
          </div>
          <input
            ref={importInputRef}
            type="file"
            accept=".zip"
            style={{ display: 'none' }}
            onChange={(e) => onImportFile(e.target.files?.[0])}
          />
          {message ? <p style={{ fontSize: 12, marginTop: 8 }}>{message}</p> : null}
        </div>

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          API keys above are stored unencrypted in this browser's local storage (no OS keychain equivalent in a
          browser) — avoid using a shared or public device.
        </p>
      </div>
    </Screen>
  );
}
