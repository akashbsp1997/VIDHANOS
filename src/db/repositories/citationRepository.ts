import { desc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { generateId } from '@/db/id';
import { citations } from '@/db/schema';
import type { Citation, NewCitation } from '@/types/db';

export const citationRepository = {
  async listByCase(caseId: string): Promise<Citation[]> {
    return db
      .select()
      .from(citations)
      .where(eq(citations.caseId, caseId))
      .orderBy(desc(citations.createdAt));
  },

  async create(input: Omit<NewCitation, 'id' | 'createdAt'>): Promise<Citation> {
    const row: NewCitation = { ...input, id: generateId(), createdAt: Date.now() };
    await db.insert(citations).values(row);
    return row as Citation;
  },

  async remove(id: string): Promise<void> {
    await db.delete(citations).where(eq(citations.id, id));
  },
};
