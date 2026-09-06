export interface LessonSection {
  heading: string;
  body: string[];
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  sections: LessonSection[];
  keyTerms?: KeyTerm[];
  mnemonics?: string[];
  practiceQuestions: PracticeQuestion[];
  revisionChecklist: string[];
}

export interface StudyBlock {
  lessonId: string;
  subject: 'PSIR Optional' | 'GS Polity' | 'Revision' | 'Rest & Reset';
  subtopic: string;
  referenceBook: string;
  chapterPages: string;
  sideNotes: string;
}

export interface DayPlan {
  day: number;
  label: string;
  blocks: StudyBlock[];
}
