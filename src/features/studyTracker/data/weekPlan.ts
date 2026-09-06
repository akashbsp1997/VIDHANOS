import type { DayPlan } from './types';

export const week1Plan: DayPlan[] = [
  {
    day: 1,
    label: 'Day 1',
    blocks: [
      {
        lessonId: 'psir-d1-scope-approaches',
        subject: 'PSIR Optional',
        subtopic: 'Meaning, Scope, and Approaches to Political Theory',
        referenceBook: 'OP Gauba (Introduction to Political Theory)',
        chapterPages: 'Chapter 1: Nature and Significance',
        sideNotes:
          'Do not try to memorize definitions. Read it like an essay or story to understand why humans study politics.',
      },
      {
        lessonId: 'polity-d1-historical-background',
        subject: 'GS Polity',
        subtopic: 'Historical Background of the Indian Constitution',
        referenceBook: 'M. Laxmikanth (Indian Polity)',
        chapterPages: 'Chapter 1: Historical Background',
        sideNotes:
          'Focus only on Regulating Act 1773 and Pitts India Act 1784. Mark changes in executive power rather than memorizing every date.',
      },
    ],
  },
  {
    day: 2,
    label: 'Day 2',
    blocks: [
      {
        lessonId: 'psir-d2-plato-justice',
        subject: 'PSIR Optional',
        subtopic: "Plato's Theory of Justice and the Ideal State",
        referenceBook: 'OP Gauba / Sushila Ramaswamy',
        chapterPages: 'Chapter on Plato',
        sideNotes:
          'Watch a 15-minute summary video on YouTube if the text feels too dense, then read just the summary section.',
      },
      {
        lessonId: 'polity-d2-making-of-constitution',
        subject: 'GS Polity',
        subtopic: 'Making of the Constitution',
        referenceBook: 'M. Laxmikanth (Indian Polity)',
        chapterPages: 'Chapter 2: Making of the Constitution',
        sideNotes:
          'Focus on broad structure — who headed which committee (e.g., Drafting Committee by B.R. Ambedkar) — without minor member names.',
      },
    ],
  },
  {
    day: 3,
    label: 'Day 3',
    blocks: [
      {
        lessonId: 'psir-d3-aristotle',
        subject: 'PSIR Optional',
        subtopic: "Aristotle's critique, Citizenship, and Classification of Governments",
        referenceBook: 'OP Gauba (Western Political Thought)',
        chapterPages: 'Chapter on Aristotle',
        sideNotes: 'Aristotle is more practical than Plato. Think of him as an early scientist categorizing political systems.',
      },
      {
        lessonId: 'polity-d3-salient-features-preamble',
        subject: 'GS Polity',
        subtopic: 'Salient Features of the Indian Constitution & Preamble',
        referenceBook: 'M. Laxmikanth (Indian Polity)',
        chapterPages: 'Chapters 3 & 4: Salient Features and Preamble',
        sideNotes:
          'Memorize keywords in the Preamble (Sovereign, Socialist, Secular, Democratic, Republic) by writing them out once.',
      },
    ],
  },
  {
    day: 4,
    label: 'Day 4',
    blocks: [
      {
        lessonId: 'psir-d4-liberty-equality',
        subject: 'PSIR Optional',
        subtopic: 'Concepts of Liberty (Negative vs. Positive) and Equality',
        referenceBook: 'OP Gauba (Introduction to Political Theory)',
        chapterPages: 'Chapters on Liberty and Equality',
        sideNotes: 'Think of real-world examples for each concept to make it intuitive rather than abstract.',
      },
      {
        lessonId: 'polity-d4-fundamental-rights-1',
        subject: 'GS Polity',
        subtopic: 'Fundamental Rights (Part III - Articles 12 to 35)',
        referenceBook: 'M. Laxmikanth (Indian Polity)',
        chapterPages: 'Chapter 7: Fundamental Rights (First half: Equality & Freedom)',
        sideNotes: 'Read articles like plain English text; do not stress about Supreme Court case laws yet.',
      },
    ],
  },
  {
    day: 5,
    label: 'Day 5',
    blocks: [
      {
        lessonId: 'psir-d5-weber-authority',
        subject: 'PSIR Optional',
        subtopic: "Max Weber's theory of Authority and Legitimate Power",
        referenceBook: 'OP Gauba (Introduction to Political Theory)',
        chapterPages: 'Chapter on Power, Authority, and Legitimacy',
        sideNotes:
          "Weber's three types of authority (Traditional, Charismatic, Legal-Rational) map easily onto history and modern leaders.",
      },
      {
        lessonId: 'polity-d5-fundamental-rights-2',
        subject: 'GS Polity',
        subtopic: 'Fundamental Rights (Remaining Articles & Exceptions)',
        referenceBook: 'M. Laxmikanth (Indian Polity)',
        chapterPages: 'Chapter 7: Fundamental Rights (Second half)',
        sideNotes: 'Take a 10-minute break halfway through if your eyes or mind feel tired.',
      },
    ],
  },
  {
    day: 6,
    label: 'Day 6',
    blocks: [
      {
        lessonId: 'guide-d6-revision',
        subject: 'Revision',
        subtopic: 'Weekly Synthesis & Safe Review',
        referenceBook: 'Notes / Highlighted text from Days 1-5',
        chapterPages: 'Review Session',
        sideNotes:
          'If you missed a day or felt overwhelmed, use today to catch up gently or just rest. Consistency matters more than volume.',
      },
    ],
  },
  {
    day: 7,
    label: 'Day 7',
    blocks: [
      {
        lessonId: 'guide-d7-rest',
        subject: 'Rest & Reset',
        subtopic: 'Complete Nervous System Reset',
        referenceBook: 'None (Absolute Break)',
        chapterPages: 'Off',
        sideNotes: 'Rest is an official part of a sustainable plan for 2027. Your brain consolidates memory while resting.',
      },
    ],
  },
];

export const allStudyBlocks = week1Plan.flatMap((day) => day.blocks);
