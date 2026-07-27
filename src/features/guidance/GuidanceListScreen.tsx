import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';

import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { documentAnalysesRepo } from '@/db/repositories/documentAnalysesRepo';

export function GuidanceListScreen() {
  const analyses = useLiveQuery(() => documentAnalysesRepo.listRecent());

  return (
    <Screen>
      <div className="screen-header">
        <h2 style={{ margin: '0 0 4px' }}>AI Guidance</h2>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
          Open a document inside a case and tap "Analyze with AI" to get department, forum, and next-step
          recommendations here.
        </p>
      </div>
      {analyses?.length === 0 ? (
        <EmptyState title="No analyses yet" />
      ) : (
        analyses?.map((a) => (
          <ListRow
            key={a.id}
            title={a.issueSummary || 'Analysis in progress'}
            subtitle={a.status === 'needs_clarification' ? 'Needs your input' : a.provider}
            meta={format(new Date(a.createdAt), 'dd MMM')}
            to={`/guidance/${a.id}`}
          />
        ))
      )}
    </Screen>
  );
}
