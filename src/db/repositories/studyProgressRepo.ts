import { db } from '../schema';
import type { StudyProgress } from '../schema';

export const studyProgressRepo = {
  listAll(): Promise<StudyProgress[]> {
    return db.studyProgress.toArray();
  },

  get(lessonId: string): Promise<StudyProgress | undefined> {
    return db.studyProgress.get(lessonId);
  },

  async setCompleted(lessonId: string, completed: boolean): Promise<void> {
    const existing = await db.studyProgress.get(lessonId);
    await db.studyProgress.put({
      id: lessonId,
      completed: completed ? 1 : 0,
      completedAt: completed ? Date.now() : undefined,
      notes: existing?.notes,
      updatedAt: Date.now(),
    });
  },

  async setNotes(lessonId: string, notes: string): Promise<void> {
    const existing = await db.studyProgress.get(lessonId);
    await db.studyProgress.put({
      id: lessonId,
      completed: existing?.completed ?? 0,
      completedAt: existing?.completedAt,
      notes,
      updatedAt: Date.now(),
    });
  },
};
