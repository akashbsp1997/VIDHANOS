import { and, asc, eq, gte, lte, min } from 'drizzle-orm';

import { db } from '@/db/client';
import { generateId } from '@/db/id';
import { cases, hearings } from '@/db/schema';
import type { Hearing, NewHearing } from '@/types/db';

async function recalculateNextHearingDate(caseId: string): Promise<void> {
  const now = Date.now();
  const [result] = await db
    .select({ next: min(hearings.hearingDate) })
    .from(hearings)
    .where(and(eq(hearings.caseId, caseId), gte(hearings.hearingDate, now)));

  await db
    .update(cases)
    .set({ nextHearingDate: result?.next ?? null, updatedAt: Date.now() })
    .where(eq(cases.id, caseId));
}

export const hearingRepository = {
  async listByCase(caseId: string): Promise<Hearing[]> {
    return db
      .select()
      .from(hearings)
      .where(eq(hearings.caseId, caseId))
      .orderBy(asc(hearings.hearingDate));
  },

  async listInRange(startMs: number, endMs: number): Promise<Hearing[]> {
    return db
      .select()
      .from(hearings)
      .where(and(gte(hearings.hearingDate, startMs), lte(hearings.hearingDate, endMs)))
      .orderBy(asc(hearings.hearingDate));
  },

  /** Nearest upcoming hearings/deadlines, used to stay under the OS local-notification cap. */
  async listUpcoming(limit: number): Promise<Hearing[]> {
    return db
      .select()
      .from(hearings)
      .where(gte(hearings.hearingDate, Date.now()))
      .orderBy(asc(hearings.hearingDate))
      .limit(limit);
  },

  async get(id: string): Promise<Hearing | undefined> {
    return db.query.hearings.findFirst({ where: eq(hearings.id, id) });
  },

  async create(input: Omit<NewHearing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Hearing> {
    const now = Date.now();
    const row: NewHearing = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    await db.insert(hearings).values(row);
    await recalculateNextHearingDate(row.caseId);
    return row as Hearing;
  },

  async update(
    id: string,
    input: Partial<Omit<NewHearing, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const existing = await hearingRepository.get(id);
    if (!existing) return;
    await db
      .update(hearings)
      .set({ ...input, updatedAt: Date.now() })
      .where(eq(hearings.id, id));
    await recalculateNextHearingDate(existing.caseId);
  },

  async setNotificationId(id: string, notificationId: string | null): Promise<void> {
    await db.update(hearings).set({ notificationId }).where(eq(hearings.id, id));
  },

  async remove(id: string): Promise<void> {
    const existing = await hearingRepository.get(id);
    if (!existing) return;
    await db.delete(hearings).where(eq(hearings.id, id));
    await recalculateNextHearingDate(existing.caseId);
  },
};
