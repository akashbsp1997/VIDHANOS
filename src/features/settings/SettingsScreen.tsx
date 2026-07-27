import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';

export function SettingsScreen() {
  return (
    <Screen>
      <EmptyState title="Settings" message="API keys and preferences coming up." />
    </Screen>
  );
}
