import type { Lesson } from '../types';

export const guideLessons: Lesson[] = [
  {
    id: 'guide-d6-revision',
    title: 'Weekly Synthesis & Safe Revision',
    summary:
      'Day 6 has no new syllabus — it is a structured active-recall session over everything read on Days 1–5, plus an honest self-audit of what still feels shaky.',
    estimatedMinutes: 90,
    learningObjectives: [
      'Recall (without looking at notes) the core idea of each of the 10 lessons covered this week',
      'Identify your two weakest topics and schedule them for extra attention next week',
      'Convert scattered notes into one-page summary sheets per subject',
    ],
    sections: [
      {
        heading: 'Why a Revision Day Beats a New-Topic Day',
        body: [
          'Spaced, active revision is what actually moves material from short-term to long-term memory — reading new content five days in a row without ever revisiting it means most of it decays before it is useful in an answer. One dedicated review day per week, done right, is worth more than an extra day of fresh reading.',
        ],
      },
      {
        heading: 'The 45-Minute Active Recall Drill (do this per subject)',
        body: [
          '1. Close all books and notes. On a blank page, write down everything you remember about each of the five lessons from this week, in your own words — headings, key terms, one example each. Do not peek for the first attempt.',
          '2. Only after the recall attempt, open your notes and mark in a different colour anything you missed or got wrong. This gap is exactly what you need to revise — do not re-read everything equally; focus time on the gaps.',
          '3. For each lesson, re-answer its three practice questions from memory, then check against the model answers in the Study Tracker.',
        ],
      },
      {
        heading: 'Build a One-Page Summary Sheet',
        body: [
          'For PSIR: one page with five rows (one per thinker/topic — Scope & Approaches, Plato, Aristotle, Liberty/Equality, Weber), each row holding only the core definition, one diagram/table, and one criticism. For GS Polity: one page with five rows (Historical Background, Making of the Constitution, Salient Features/Preamble, FR-I, FR-II), each row holding only the key Articles/dates/names. These sheets — not the original notes — are what you should re-read the night before the exam, months from now.',
        ],
      },
      {
        heading: 'Honest Self-Audit',
        body: [
          'Rate each of the 10 lessons 1–5 for how confidently you could write a 10-mark answer on it right now, with no notes. Anything rated 3 or below goes on a "revisit in Week 2" list. Consistency and honest self-assessment compound over months — a UPSC preparation cycle is closer to a marathon than a sprint, so do not let one shaky topic snowball into avoidance.',
        ],
      },
    ],
    practiceQuestions: [
      {
        question: 'What is the single biggest mistake candidates make on a "revision day"?',
        answer:
          'Passively re-reading notes instead of active recall — re-reading feels productive but produces much weaker retention than trying to reproduce the material from memory first and only then checking gaps.',
      },
      {
        question: 'Why build one-page summary sheets instead of relying on the original week-1 notes for later revision?',
        answer:
          'Because dense original notes take too long to re-read repeatedly over months of preparation; a condensed one-page-per-subject sheet, built once and refined, is what you can realistically revisit dozens of times before the exam.',
      },
    ],
    revisionChecklist: [
      'Completed a closed-book recall attempt for all 10 lessons',
      'Marked and reviewed every gap found during recall',
      'Built (or updated) one-page summary sheets for PSIR and GS Polity',
      'Listed weak topics (rated ≤3) to revisit in Week 2',
    ],
  },
  {
    id: 'guide-d7-rest',
    title: 'Rest & Reset — Complete Nervous System Reset',
    summary:
      "Day 7 is deliberately empty of syllabus. Rest is a scheduled, official part of a sustainable multi-year UPSC preparation plan, not a lapse in discipline.",
    estimatedMinutes: 0,
    learningObjectives: [
      'Understand why scheduled rest improves long-term retention and prevents burnout',
      'Plan the rest day so it is genuinely restorative, not just "no studying but still stressed"',
    ],
    sections: [
      {
        heading: 'Why Rest Is Part of the Plan, Not a Break From It',
        body: [
          'Memory consolidation — the process by which what you studied this week moves from short-term into durable long-term memory — happens substantially during rest and sleep, not only during active study. Chronic, unbroken study across months without recovery days reliably produces worse long-term output: slower reading, poorer recall, and higher dropout risk from the preparation itself. A 2027-track UPSC preparation is a multi-month endurance effort; treat today\'s rest with the same seriousness as yesterday\'s revision.',
        ],
      },
      {
        heading: 'What "Off" Should Actually Look Like',
        body: [
          'Step away from books, coaching videos, and PDFs entirely for the day. If you genuinely enjoy current affairs as leisure reading, that is fine in moderation — but do not schedule any structured revision, targets, or self-testing today. Protect sleep (aim for 7–8 hours), get some physical movement (a walk, a sport, light exercise), and spend time on whatever restores your energy — family, hobbies, or simply doing nothing with no guilt attached.',
        ],
      },
      {
        heading: 'If You Fell Behind This Week',
        body: [
          'If a day or two was missed, resist the urge to use this day to "catch up" under pressure — that defeats the purpose of the reset and usually produces poor-quality, resentful studying. A missed day is recovered far better by simply continuing the plan calmly from tomorrow than by cramming today. Consistency across months matters far more than completing every single day exactly on schedule.',
        ],
      },
    ],
    practiceQuestions: [],
    revisionChecklist: [
      'No structured study, targets, or self-testing attempted today',
      'Slept 7–8 hours and got some physical movement',
      'Did not use today to guilt-cram missed material',
    ],
  },
];
