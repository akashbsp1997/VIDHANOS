import { desc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { generateId } from '@/db/id';
import { caseOpponents, cases, clients, opponents } from '@/db/schema';
import type { Case, CaseWithRelations, NewCase } from '@/types/db';

export const caseRepository = {
  async list(): Promise<Case[]> {
    return db.select().from(cases).orderBy(desc(cases.updatedAt));
  },

  async get(id: string): Promise<CaseWithRelations | undefined> {
    const caseRow = await db.query.cases.findFirst({ where: eq(cases.id, id) });
    if (!caseRow) return undefined;

    const client = await db.query.clients.findFirst({ where: eq(clients.id, caseRow.clientId) });
    if (!client) return undefined;

    const opponentRows = await db
      .select({ opponent: opponents })
      .from(caseOpponents)
      .innerJoin(opponents, eq(caseOpponents.opponentId, opponents.id))
      .where(eq(caseOpponents.caseId, id));

    return {
      ...caseRow,
      client,
      opponents: opponentRows.map((row) => row.opponent),
    };
  },

  async create(
    input: Omit<NewCase, 'id' | 'createdAt' | 'updatedAt'>,
    opponentIds: string[] = []
  ): Promise<Case> {
    const now = Date.now();
    const row: NewCase = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    await db.insert(cases).values(row);

    if (opponentIds.length > 0) {
      await db
        .insert(caseOpponents)
        .values(opponentIds.map((opponentId) => ({ id: generateId(), caseId: row.id, opponentId })));
    }

    return row as Case;
  },

  async update(
    id: string,
    input: Partial<Omit<NewCase, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    await db
      .update(cases)
      .set({ ...input, updatedAt: Date.now() })
      .where(eq(cases.id, id));
  },

  async setOpponents(caseId: string, opponentIds: string[]): Promise<void> {
    await db.delete(caseOpponents).where(eq(caseOpponents.caseId, caseId));
    if (opponentIds.length > 0) {
      await db
        .insert(caseOpponents)
        .values(opponentIds.map((opponentId) => ({ id: generateId(), caseId, opponentId })));
    }
  },

  async updateNextHearingDate(caseId: string, nextHearingDate: number | null): Promise<void> {
    await db.update(cases).set({ nextHearingDate, updatedAt: Date.now() }).where(eq(cases.id, caseId));
  },

  async remove(id: string): Promise<void> {
    await db.delete(caseOpponents).where(eq(caseOpponents.caseId, id));
    await db.delete(cases).where(eq(cases.id, id));
  },
};
