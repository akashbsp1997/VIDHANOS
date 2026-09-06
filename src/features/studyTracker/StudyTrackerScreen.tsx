import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';

import { Screen } from '@/components/Screen';
import { studyProgressRepo } from '@/db/repositories/studyProgressRepo';
import { week1Plan, allStudyBlocks } from './data/weekPlan';
import { lessonsById } from './data/lessons';
import { StudyBlockRow } from './StudyBlockRow';

export function StudyTrackerScreen() {
  const progress = useLiveQuery(() => studyProgressRepo.listAll());

  const completedIds = useMemo(() => {
    const set = new Set<string>();
    (progress ?? []).forEach((p) => {
      if (p.completed === 1) set.add(p.id);
    });
    return set;
  }, [progress]);

  const totalLessons = allStudyBlocks.length;
  const completedCount = allStudyBlocks.filter((b) => completedIds.has(b.lessonId)).length;
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <Screen>
      <div className="screen-header">
        <h2 style={{ margin: '0 0 4px' }}>UPSC Week 1 Study Tracker</h2>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>
          PSIR Optional + GS Polity, day by day. Tap any topic to open its lesson material.
        </p>

        <div className="study-progress-summary">
          <div className="study-progress-track">
            <div className="study-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="study-progress-label">
            {completedCount} / {totalLessons} lessons complete ({percent}%)
          </span>
        </div>
      </div>

      {week1Plan.map((dayPlan) => {
        const dayCompleted = dayPlan.blocks.filter((b) => completedIds.has(b.lessonId)).length;
        return (
          <section key={dayPlan.day} className="section study-day-card">
            <div className="study-day-header">
              <span className="section-title" style={{ margin: 0 }}>
                {dayPlan.label}
              </span>
              <span className="study-day-progress">
                {dayCompleted}/{dayPlan.blocks.length}
              </span>
            </div>
            {dayPlan.blocks.map((block) => (
              <StudyBlockRow
                key={block.lessonId}
                block={block}
                lesson={lessonsById[block.lessonId]}
                completed={completedIds.has(block.lessonId)}
              />
            ))}
          </section>
        );
      })}
    </Screen>
  );
}
