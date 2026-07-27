import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { casesRepo } from '@/db/repositories/casesRepo';

export function CaseListScreen() {
  const cases = useLiveQuery(() => casesRepo.list());
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!cases) return [];
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.forumName ?? '').toLowerCase().includes(q) ||
        (c.cnrNumber ?? '').toLowerCase().includes(q)
    );
  }, [cases, query]);

  return (
    <Screen>
      <div className="screen-header">
        <TextField label="Search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, forum, CNR" />
        <Link to="/new-matter">
          <Button label="New Matter" />
        </Link>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No cases yet" message="Start a New Matter to add your first case." />
      ) : (
        filtered.map((c) => (
          <ListRow
            key={c.id}
            title={c.title}
            subtitle={[c.caseType, c.forumName].filter(Boolean).join(' · ') || undefined}
            meta={c.nextHearingDate ? format(new Date(c.nextHearingDate), 'dd MMM') : c.caseStatus}
            to={`/cases/${c.id}`}
          />
        ))
      )}
    </Screen>
  );
}
