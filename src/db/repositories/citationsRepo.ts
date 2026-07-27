import { generateId } from '@/lib/ids';
import { db, type Citation } from '../schema';

export const citationsRepo = {
  listByCase(caseId: string): Promise<Citation[]> {
    return db.citations.where('caseId').equals(caseId).reverse().sortBy('createdAt');
  },

  async create(input: Omit<Citation, 'id' | 'createdAt'> & { id?: string }): Promise<Citation> {
    const row: Citation = { ...input, id: input.id ?? generateId(), createdAt: Date.now() };
    await db.citations.add(row);
    return row;
  },

  async remove(id: string): Promise<void> {
    await db.citations.delete(id);
  },
};
