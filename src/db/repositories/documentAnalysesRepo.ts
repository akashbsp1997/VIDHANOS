import { generateId } from '@/lib/ids';
import { db, type DocumentAnalysis } from '../schema';

export const documentAnalysesRepo = {
  listByDocument(documentId: string): Promise<DocumentAnalysis[]> {
    return db.documentAnalyses.where('documentId').equals(documentId).reverse().sortBy('createdAt');
  },

  async listRecent(limit = 30): Promise<DocumentAnalysis[]> {
    const all = await db.documentAnalyses.reverse().sortBy('createdAt');
    return all.slice(0, limit);
  },

  get(id: string): Promise<DocumentAnalysis | undefined> {
    return db.documentAnalyses.get(id);
  },

  async create(input: Omit<DocumentAnalysis, 'id' | 'createdAt' | 'updatedAt'>): Promise<DocumentAnalysis> {
    const now = Date.now();
    const row: DocumentAnalysis = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    await db.documentAnalyses.add(row);
    return row;
  },

  async update(
    id: string,
    input: Partial<Omit<DocumentAnalysis, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    await db.documentAnalyses.update(id, { ...input, updatedAt: Date.now() });
  },
};
