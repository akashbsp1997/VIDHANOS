import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import * as schema from './schema';

export const sqliteDb = openDatabaseSync('vidhanos.db', { enableChangeListener: true });

export const db = drizzle(sqliteDb, { schema });

export type Database = typeof db;
