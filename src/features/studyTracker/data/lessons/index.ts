import type { Lesson } from '../types';
import { psirLessons } from './psir';
import { polityLessons } from './polity';
import { guideLessons } from './guides';

export const allLessons: Lesson[] = [...psirLessons, ...polityLessons, ...guideLessons];

export const lessonsById: Record<string, Lesson> = Object.fromEntries(
  allLessons.map((lesson) => [lesson.id, lesson]),
);
