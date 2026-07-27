import { useEffect, useState, type ReactNode } from 'react';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { settingsRepo } from '@/db/repositories/settingsRepo';

export function OnboardingGate({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([settingsRepo.getGeminiApiKey(), settingsRepo.getOnboardingDismissed()]).then(
      ([key, dismissed]) => {
        setNeedsOnboarding(!key && !dismissed);
        setChecking(false);
      }
    );
  }, []);

  const onSave = async () => {
    if (!keyInput.trim()) return;
    setSaving(true);
    await settingsRepo.setGeminiApiKey(keyInput.trim());
    setSaving(false);
    setNeedsOnboarding(false);
  };

  const onSkip = async () => {
    await settingsRepo.setOnboardingDismissed(true);
    setNeedsOnboarding(false);
  };

  if (checking) return <Screen>{null}</Screen>;

  if (!needsOnboarding) return <>{children}</>;

  return (
    <Screen>
      <div className="screen-header">
        <h1 style={{ fontSize: 22, margin: '24px 0 8px' }}>Welcome to VIDHANOS</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
          VIDHANOS uses Gemini to read uploaded documents and suggest the right forum, authority, and
          parties for a new matter. Add your Gemini API key now to enable that — or skip for now and add
          it later in Settings. Case, document, and calendar management all still work fully offline
          without it.
        </p>
        <TextField
          label="Gemini API key"
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="Paste your API key"
        />
        <div className="btn-row" style={{ flexDirection: 'column' }}>
          <Button label="Save Key" onClick={onSave} loading={saving} disabled={!keyInput.trim()} />
          <Button label="Skip for now" variant="secondary" onClick={onSkip} />
        </div>
      </div>
    </Screen>
  );
}
