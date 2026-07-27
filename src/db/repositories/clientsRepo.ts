import { generateId } from '@/lib/ids';
import { db, type Client } from '../schema';

export const clientsRepo = {
  list(): Promise<Client[]> {
    return db.clients.orderBy('name').toArray();
  },

  get(id: string): Promise<Client | undefined> {
    return db.clients.get(id);
  },

  async create(input: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const now = Date.now();
    const row: Client = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    await db.clients.add(row);
    return row;
  },

  async update(id: string, input: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    await db.clients.update(id, { ...input, updatedAt: Date.now() });
  },

  async remove(id: string): Promise<void> {
    await db.clients.delete(id);
  },
};
