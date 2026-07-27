import { generateId } from '@/lib/ids';
import { db, type Case, type Client, type Opponent } from '../schema';

export interface CaseWithRelations extends Case {
  client: Client;
  opponents: Opponent[];
}

export const casesRepo = {
  list(): Promise<Case[]> {
    return db.cases.reverse().sortBy('updatedAt');
  },

  async get(id: string): Promise<CaseWithRelations | undefined> {
    const caseRow = await db.cases.get(id);
    if (!caseRow) return undefined;

    const client = await db.clients.get(caseRow.clientId);
    if (!client) return undefined;

    const links = await db.caseOpponents.where('caseId').equals(id).toArray();
    const opponents = (await db.opponents.bulkGet(links.map((l) => l.opponentId))).filter(
      (o): o is Opponent => o !== undefined
    );

    return { ...caseRow, client, opponents };
  },

  async create(
    input: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>,
    opponentIds: string[] = []
  ): Promise<Case> {
    const now = Date.now();
    const row: Case = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    await db.cases.add(row);

    if (opponentIds.length > 0) {
      await db.caseOpponents.bulkAdd(
        opponentIds.map((opponentId) => ({ id: generateId(), caseId: row.id, opponentId }))
      );
    }

    return row;
  },

  async update(id: string, input: Partial<Omit<Case, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    await db.cases.update(id, { ...input, updatedAt: Date.now() });
  },

  async setOpponents(caseId: string, opponentIds: string[]): Promise<void> {
    const existing = await db.caseOpponents.where('caseId').equals(caseId).toArray();
    await db.caseOpponents.bulkDelete(existing.map((e) => e.id));
    if (opponentIds.length > 0) {
      await db.caseOpponents.bulkAdd(
        opponentIds.map((opponentId) => ({ id: generateId(), caseId, opponentId }))
      );
    }
  },

  async updateNextHearingDate(caseId: string, nextHearingDate: number | undefined): Promise<void> {
    await db.cases.update(caseId, { nextHearingDate, updatedAt: Date.now() });
  },

  async remove(id: string): Promise<void> {
    const links = await db.caseOpponents.where('caseId').equals(id).toArray();
    await db.caseOpponents.bulkDelete(links.map((l) => l.id));
    await db.cases.delete(id);
  },
};
