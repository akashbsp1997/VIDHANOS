import { desc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { generateId } from '@/db/id';
import { documents } from '@/db/schema';
import type { Document, NewDocument } from '@/types/db';

export const documentRepository = {
  async listByCase(caseId: string): Promise<Document[]> {
    return db
      .select()
      .from(documents)
      .where(eq(documents.caseId, caseId))
      .orderBy(desc(documents.createdAt));
  },

  async get(id: string): Promise<Document | undefined> {
    return db.query.documents.findFirst({ where: eq(documents.id, id) });
  },

  async create(
    input: Omit<NewDocument, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Document> {
    const now = Date.now();
    const row: NewDocument = { ...input, id: input.id ?? generateId(), createdAt: now, updatedAt: now };
    await db.insert(documents).values(row);
    return row as Document;
  },

  async update(
    id: string,
    input: Partial<Omit<NewDocument, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    await db
      .update(documents)
      .set({ ...input, updatedAt: Date.now() })
      .where(eq(documents.id, id));
  },

  async remove(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  },
};
