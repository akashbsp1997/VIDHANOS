import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export function GuidanceScreen() {
  return (
    <Screen>
      <EmptyState
        title="AI Guidance"
        message="Open a document inside a case and tap 'Analyze with AI' to get department, forum, and next-step recommendations here."
      />
    </Screen>
  );
}
