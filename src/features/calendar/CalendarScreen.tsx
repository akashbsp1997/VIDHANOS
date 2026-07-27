import { useLiveQuery } from 'dexie-react-hooks';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { casesRepo } from '@/db/repositories/casesRepo';
import { hearingsRepo } from '@/db/repositories/hearingsRepo';

export function CalendarScreen() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => startOfDay(new Date()));

  const rangeStart = startOfWeek(startOfMonth(month)).getTime();
  const rangeEnd = endOfWeek(endOfMonth(month)).getTime();

  const hearings = useLiveQuery(() => hearingsRepo.listInRange(rangeStart, rangeEnd), [rangeStart, rangeEnd]);
  const cases = useLiveQuery(() => casesRepo.list());

  const caseTitleById = useMemo(() => {
    const map = new Map<string, string>();
    (cases ?? []).forEach((c) => map.set(c.id, c.title));
    return map;
  }, [cases]);

  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

  const hearingsByDay = useMemo(() => {
    const map = new Map<string, number>();
    (hearings ?? []).forEach((h) => {
      const key = format(new Date(h.hearingDate), 'yyyy-MM-dd');
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [hearings]);

  const dayHearings = (hearings ?? []).filter((h) => isSameDay(h.hearingDate, selectedDay));

  return (
    <Screen>
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button type="button" className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => setMonth((m) => addMonths(m, -1))}>
            ←
          </button>
          <strong>{format(month, 'MMMM yyyy')}</strong>
          <button type="button" className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => setMonth((m) => addMonths(m, 1))}>
            →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>
              {d}
            </div>
          ))}
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const hasHearings = hearingsByDay.has(key);
            const selected = isSameDay(day, selectedDay);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(startOfDay(day))}
                style={{
                  aspectRatio: '1',
                  border: 'none',
                  borderRadius: 8,
                  background: selected ? 'var(--color-primary)' : 'transparent',
                  color: selected ? '#fff' : isSameMonth(day, month) ? 'var(--color-text)' : 'var(--color-text-muted)',
                  fontSize: 13,
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                {format(day, 'd')}
                {hasHearings ? (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: selected ? '#fff' : 'var(--color-accent)',
                    }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', margin: '0 16px 4px', textTransform: 'uppercase' }}>
        {format(selectedDay, 'EEEE, dd MMM')}
      </p>
      {dayHearings.length === 0 ? (
        <EmptyState title="Nothing scheduled" message="No hearings or deadlines on this day." />
      ) : (
        dayHearings.map((h) => (
          <ListRow
            key={h.id}
            title={h.orderSummary || h.purpose || (h.isDeadline ? 'Deadline' : 'Hearing')}
            subtitle={caseTitleById.get(h.caseId)}
            meta={format(new Date(h.hearingDate), 'h:mm a')}
            to={`/cases/${h.caseId}`}
          />
        ))
      )}
    </Screen>
  );
}
