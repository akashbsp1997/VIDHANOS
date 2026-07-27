import { useLiveQuery } from 'dexie-react-hooks';
import { addDays, format, isToday, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { casesRepo } from '@/db/repositories/casesRepo';
import { hearingsRepo } from '@/db/repositories/hearingsRepo';
import type { Hearing } from '@/db/schema';

export function DashboardScreen() {
  const rangeStart = startOfDay(addDays(new Date(), -30)).getTime();
  const rangeEnd = addDays(new Date(), 30).getTime();

  const hearings = useLiveQuery(() => hearingsRepo.listInRange(rangeStart, rangeEnd));
  const cases = useLiveQuery(() => casesRepo.list());

  const caseTitleById = useMemo(() => {
    const map = new Map<string, string>();
    (cases ?? []).forEach((c) => map.set(c.id, c.title));
    return map;
  }, [cases]);

  const buckets = useMemo(() => {
    const todayStart = startOfDay(new Date()).getTime();
    const weekEnd = addDays(new Date(), 7).getTime();
    const overdue: Hearing[] = [];
    const today: Hearing[] = [];
    const thisWeek: Hearing[] = [];
    const later: Hearing[] = [];

    (hearings ?? []).forEach((h) => {
      if (h.hearingDate < todayStart) overdue.push(h);
      else if (isToday(h.hearingDate)) today.push(h);
      else if (h.hearingDate <= weekEnd) thisWeek.push(h);
      else later.push(h);
    });

    return { overdue, today, thisWeek, later };
  }, [hearings]);

  return (
    <Screen>
      <div className="screen-header">
        <h1 style={{ margin: '0 0 4px', fontSize: 24 }}>VIDHANOS</h1>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--color-text-muted)' }}>
          {(cases ?? []).length} active cases
        </p>
        <Link to="/new-matter">
          <Button label="New Matter" />
        </Link>
      </div>

      <Bucket title="Overdue" items={buckets.overdue} caseTitleById={caseTitleById} />
      <Bucket title="Today" items={buckets.today} caseTitleById={caseTitleById} />
      <Bucket title="This Week" items={buckets.thisWeek} caseTitleById={caseTitleById} />
      <Bucket title="Later" items={buckets.later} caseTitleById={caseTitleById} />

      {hearings && hearings.length === 0 ? (
        <EmptyState title="Nothing coming up" message="Hearings and deadlines will show here." />
      ) : null}
    </Screen>
  );
}

function Bucket({
  title,
  items,
  caseTitleById,
}: {
  title: string;
  items: Hearing[];
  caseTitleById: Map<string, string>;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', margin: '0 16px 4px', textTransform: 'uppercase' }}>
        {title}
      </p>
      {items.map((h) => (
        <ListRow
          key={h.id}
          title={h.orderSummary || h.purpose || (h.isDeadline ? 'Deadline' : 'Hearing')}
          subtitle={caseTitleById.get(h.caseId)}
          meta={format(new Date(h.hearingDate), 'dd MMM')}
          to={`/cases/${h.caseId}`}
        />
      ))}
    </div>
  );
}
