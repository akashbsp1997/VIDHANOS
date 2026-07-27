import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { generateId } from '@/db/id';
import { opponents } from '@/db/schema';
import type { NewOpponent, Opponent } from '@/types/db';

export const opponentRepository = {
  async list(): Promise<Opponent[]> {
    return db.select().from(opponents).orderBy(opponents.name);
  },

  async get(id: string): Promise<Opponent | undefined> {
    return db.query.opponents.findFirst({ where: eq(opponents.id, id) });
  },

  async create(input: Omit<NewOpponent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Opponent> {
    const now = Date.now();
    const row: NewOpponent = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    await db.insert(opponents).values(row);
    return row as Opponent;
  },

  async update(
    id: string,
    input: Partial<Omit<NewOpponent, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    await db
      .update(opponents)
      .set({ ...input, updatedAt: Date.now() })
      .where(eq(opponents.id, id));
  },

  async remove(id: string): Promise<void> {
    await db.delete(opponents).where(eq(opponents.id, id));
  },
};
