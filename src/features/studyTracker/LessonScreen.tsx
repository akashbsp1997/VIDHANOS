import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { Link, useParams } from 'react-router';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { studyProgressRepo } from '@/db/repositories/studyProgressRepo';
import { lessonsById } from './data/lessons';
import { allStudyBlocks } from './data/weekPlan';

function PracticeQuestion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="study-question">
      <p className="study-question-text">{question}</p>
      {open ? (
        <p className="study-question-answer">{answer}</p>
      ) : (
        <button type="button" className="study-reveal-btn" onClick={() => setOpen(true)}>
          Reveal answer
        </button>
      )}
    </div>
  );
}

export function LessonScreen() {
  const { lessonId } = useParams();
  const lesson = lessonId ? lessonsById[lessonId] : undefined;
  const block = allStudyBlocks.find((b) => b.lessonId === lessonId);
  const progress = useLiveQuery(() => (lessonId ? studyProgressRepo.get(lessonId) : undefined), [lessonId]);
  const completed = progress?.completed === 1;

  if (!lesson || !block) {
    return (
      <Screen>
        <div className="screen-header">
          <p>Lesson not found.</p>
          <Link to="/study">Back to Study Tracker</Link>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="screen-header">
        <Link to="/study" style={{ fontSize: 13, textDecoration: 'none' }}>
          ← Study Tracker
        </Link>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', margin: '12px 0 4px' }}>
          {block.subject} · {lesson.estimatedMinutes} min
        </p>
        <h2 style={{ margin: '0 0 8px' }}>{lesson.title}</h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>{lesson.summary}</p>
        <Button
          label={completed ? '✓ Completed — tap to undo' : 'Mark lesson complete'}
          variant={completed ? 'secondary' : 'primary'}
          onClick={() => studyProgressRepo.setCompleted(lesson.id, !completed)}
        />
      </div>

      <div className="section">
        <p className="section-title">Reference</p>
        <p style={{ fontSize: 14, margin: '0 0 4px', fontWeight: 600 }}>{block.referenceBook}</p>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>{block.chapterPages}</p>
      </div>

      <div className="banner-warning" style={{ margin: '0 16px 16px' }}>
        <strong>How to read today: </strong>
        {block.sideNotes}
      </div>

      {lesson.learningObjectives.length > 0 ? (
        <div className="section">
          <p className="section-title">Learning Objectives</p>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>
            {lesson.learningObjectives.map((obj) => (
              <li key={obj} style={{ marginBottom: 4 }}>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {lesson.sections.map((section) => (
        <div className="section" key={section.heading}>
          <p className="section-title">{section.heading}</p>
          {section.body.map((para, idx) => (
            <p key={idx} style={{ fontSize: 14, lineHeight: 1.55, margin: '0 0 10px' }}>
              {para}
            </p>
          ))}
        </div>
      ))}

      {lesson.keyTerms && lesson.keyTerms.length > 0 ? (
        <div className="section">
          <p className="section-title">Key Terms</p>
          {lesson.keyTerms.map((kt) => (
            <div key={kt.term} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{kt.term}: </span>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{kt.definition}</span>
            </div>
          ))}
        </div>
      ) : null}

      {lesson.mnemonics && lesson.mnemonics.length > 0 ? (
        <div className="section" style={{ background: 'var(--color-warning-bg)', borderColor: 'var(--color-warning)' }}>
          <p className="section-title" style={{ color: 'var(--color-warning)' }}>
            Quick Recall
          </p>
          {lesson.mnemonics.map((m) => (
            <p key={m} style={{ fontSize: 13, margin: '0 0 6px', color: 'var(--color-warning)' }}>
              {m}
            </p>
          ))}
        </div>
      ) : null}

      {lesson.practiceQuestions.length > 0 ? (
        <div className="section">
          <p className="section-title">Practice Questions</p>
          {lesson.practiceQuestions.map((pq) => (
            <PracticeQuestion key={pq.question} question={pq.question} answer={pq.answer} />
          ))}
        </div>
      ) : null}

      <div className="section">
        <p className="section-title">Before Moving On</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>
          {lesson.revisionChecklist.map((item) => (
            <li key={item} style={{ marginBottom: 4 }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  );
}
