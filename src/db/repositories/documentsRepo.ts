import { generateId } from '@/lib/ids';
import { db, type DocumentRecord } from '../schema';

export const documentsRepo = {
  listByCase(caseId: string): Promise<DocumentRecord[]> {
    return db.documents.where('caseId').equals(caseId).reverse().sortBy('createdAt');
  },

  get(id: string): Promise<DocumentRecord | undefined> {
    return db.documents.get(id);
  },

  async create(
    input: Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<DocumentRecord> {
    const now = Date.now();
    const row: DocumentRecord = { ...input, id: input.id ?? generateId(), createdAt: now, updatedAt: now };
    await db.documents.add(row);
    return row;
  },

  async remove(id: string): Promise<void> {
    await db.documents.delete(id);
  },
};
