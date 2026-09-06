import type { MouseEvent } from 'react';
import { Link } from 'react-router';

import { studyProgressRepo } from '@/db/repositories/studyProgressRepo';
import type { Lesson, StudyBlock } from './data/types';

const SUBJECT_CLASS: Record<StudyBlock['subject'], string> = {
  'PSIR Optional': 'study-chip-psir',
  'GS Polity': 'study-chip-polity',
  Revision: 'study-chip-revision',
  'Rest & Reset': 'study-chip-rest',
};

interface StudyBlockRowProps {
  block: StudyBlock;
  lesson: Lesson | undefined;
  completed: boolean;
}

export function StudyBlockRow({ block, lesson, completed }: StudyBlockRowProps) {
  function toggle(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    studyProgressRepo.setCompleted(block.lessonId, !completed);
  }

  return (
    <Link to={`/study/${block.lessonId}`} className="study-block-row">
      <button
        type="button"
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
        className={`study-checkbox${completed ? ' checked' : ''}`}
        onClick={toggle}
      >
        {completed ? '✓' : ''}
      </button>
      <div className="study-block-main">
        <div className="study-block-top">
          <span className={`study-chip ${SUBJECT_CLASS[block.subject]}`}>{block.subject}</span>
          {lesson ? <span className="study-block-minutes">{lesson.estimatedMinutes} min</span> : null}
        </div>
        <div className={`study-block-title${completed ? ' completed' : ''}`}>{block.subtopic}</div>
        <div className="study-block-book">
          {block.referenceBook} · {block.chapterPages}
        </div>
      </div>
    </Link>
  );
}
