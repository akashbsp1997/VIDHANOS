import { generateId } from '@/lib/ids';
import { casesRepo } from './casesRepo';
import { db, type Hearing } from '../schema';

async function recalculateNextHearingDate(caseId: string): Promise<void> {
  const upcoming = await db.hearings
    .where('caseId')
    .equals(caseId)
    .filter((h) => h.hearingDate >= Date.now())
    .toArray();

  const next = upcoming.length > 0 ? Math.min(...upcoming.map((h) => h.hearingDate)) : undefined;
  await casesRepo.updateNextHearingDate(caseId, next);
}

export const hearingsRepo = {
  listByCase(caseId: string): Promise<Hearing[]> {
    return db.hearings.where('caseId').equals(caseId).sortBy('hearingDate');
  },

  async listInRange(startMs: number, endMs: number): Promise<Hearing[]> {
    return db.hearings.where('hearingDate').between(startMs, endMs, true, true).sortBy('hearingDate');
  },

  async listUpcoming(limit: number): Promise<Hearing[]> {
    const all = await db.hearings
      .where('hearingDate')
      .aboveOrEqual(Date.now())
      .sortBy('hearingDate');
    return all.slice(0, limit);
  },

  get(id: string): Promise<Hearing | undefined> {
    return db.hearings.get(id);
  },

  async create(input: Omit<Hearing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Hearing> {
    const now = Date.now();
    const row: Hearing = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    await db.hearings.add(row);
    await recalculateNextHearingDate(row.caseId);
    return row;
  },

  async update(id: string, input: Partial<Omit<Hearing, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const existing = await db.hearings.get(id);
    if (!existing) return;
    await db.hearings.update(id, { ...input, updatedAt: Date.now() });
    await recalculateNextHearingDate(existing.caseId);
  },

  async remove(id: string): Promise<void> {
    const existing = await db.hearings.get(id);
    if (!existing) return;
    await db.hearings.delete(id);
    await recalculateNextHearingDate(existing.caseId);
  },
};
