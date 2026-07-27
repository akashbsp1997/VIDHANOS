import { generateId } from '@/lib/ids';
import { db, type Opponent } from '../schema';

export const opponentsRepo = {
  list(): Promise<Opponent[]> {
    return db.opponents.orderBy('name').toArray();
  },

  get(id: string): Promise<Opponent | undefined> {
    return db.opponents.get(id);
  },

  async create(input: Omit<Opponent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Opponent> {
    const now = Date.now();
    const row: Opponent = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    await db.opponents.add(row);
    return row;
  },

  async update(id: string, input: Partial<Omit<Opponent, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    await db.opponents.update(id, { ...input, updatedAt: Date.now() });
  },

  async remove(id: string): Promise<void> {
    await db.opponents.delete(id);
  },
};
