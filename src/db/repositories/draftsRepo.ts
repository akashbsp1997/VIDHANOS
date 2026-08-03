import { generateId } from '@/lib/ids';
import { db, type Draft } from '../schema';

export const draftsRepo = {
  listByCase(caseId: string): Promise<Draft[]> {
    return db.drafts.where('caseId').equals(caseId).reverse().sortBy('updatedAt');
  },

  get(id: string): Promise<Draft | undefined> {
    return db.drafts.get(id);
  },

  async create(input: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Draft> {
    const now = Date.now();
    const row: Draft = { ...input, id: input.id ?? generateId(), createdAt: now, updatedAt: now };
    await db.drafts.add(row);
    return row;
  },

  async update(id: string, input: Partial<Omit<Draft, 'id' | 'caseId' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    await db.drafts.update(id, { ...input, updatedAt: Date.now() });
  },

  async remove(id: string): Promise<void> {
    await db.drafts.delete(id);
  },
};
