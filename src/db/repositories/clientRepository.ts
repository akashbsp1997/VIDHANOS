import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { generateId } from '@/db/id';
import { clients } from '@/db/schema';
import type { Client, NewClient } from '@/types/db';

export const clientRepository = {
  async list(): Promise<Client[]> {
    return db.select().from(clients).orderBy(clients.name);
  },

  async get(id: string): Promise<Client | undefined> {
    return db.query.clients.findFirst({ where: eq(clients.id, id) });
  },

  async create(input: Omit<NewClient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const now = Date.now();
    const row: NewClient = { ...input, id: generateId(), createdAt: now, updatedAt: now };
    await db.insert(clients).values(row);
    return row as Client;
  },

  async update(
    id: string,
    input: Partial<Omit<NewClient, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    await db
      .update(clients)
      .set({ ...input, updatedAt: Date.now() })
      .where(eq(clients.id, id));
  },

  async remove(id: string): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  },
};
