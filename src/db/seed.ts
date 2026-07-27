import legalReferencesSeed from '../../assets/seed/legalReferences.json';
import { db } from './client';
import { generateId } from './id';
import { legalReferences } from './schema';

export async function seedLegalReferencesIfEmpty(): Promise<void> {
  const existing = await db.select({ id: legalReferences.id }).from(legalReferences).limit(1);
  if (existing.length > 0) {
    return;
  }

  const rows = legalReferencesSeed.map((entry) => ({
    id: generateId(),
    category: entry.category,
    name: entry.name,
    description: entry.description,
    appliesToKeywords: entry.appliesToKeywords,
    jurisdictionLevel: entry.jurisdictionLevel,
  }));

  await db.insert(legalReferences).values(rows);
}
