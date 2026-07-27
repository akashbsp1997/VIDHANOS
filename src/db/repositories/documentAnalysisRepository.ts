import { desc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { generateId } from '@/db/id';
import { documentAnalyses } from '@/db/schema';
import type { DocumentAnalysis, NewDocumentAnalysis } from '@/types/db';

export const documentAnalysisRepository = {
  async listByDocument(documentId: string): Promise<DocumentAnalysis[]> {
    return db
      .select()
      .from(documentAnalyses)
      .where(eq(documentAnalyses.documentId, documentId))
      .orderBy(desc(documentAnalyses.createdAt));
  },

  async listRecent(limit = 30): Promise<DocumentAnalysis[]> {
    return db.select().from(documentAnalyses).orderBy(desc(documentAnalyses.createdAt)).limit(limit);
  },

  async get(id: string): Promise<DocumentAnalysis | undefined> {
    return db.query.documentAnalyses.findFirst({ where: eq(documentAnalyses.id, id) });
  },

  async create(
    input: Omit<NewDocumentAnalysis, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DocumentAnalysis> {
    const now = Date.now();
    const row: NewDocumentAnalysis = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    await db.insert(documentAnalyses).values(row);
    return row as DocumentAnalysis;
  },

  async update(
    id: string,
    input: Partial<Omit<NewDocumentAnalysis, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    await db
      .update(documentAnalyses)
      .set({ ...input, updatedAt: Date.now() })
      .where(eq(documentAnalyses.id, id));
  },
};
