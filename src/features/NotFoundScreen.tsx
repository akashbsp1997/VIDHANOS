import { Link } from 'react-router';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export function NotFoundScreen() {
  return (
    <Screen>
      <EmptyState title="Page not found" />
      <div className="screen-header">
        <Link to="/">Back to Dashboard</Link>
      </div>
    </Screen>
  );
}
