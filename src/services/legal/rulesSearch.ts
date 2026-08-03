import MiniSearch from 'minisearch';

import legalRulesData from '@/data/legalRules.json';

export interface LegalRuleEntry {
  id: string;
  category: string;
  title: string;
  sourceType: string;
  url: string;
  fetchedAt: string | null;
  excerpt: string;
  fullText: string;
  fetchError: string | null;
}

const entries = legalRulesData as LegalRuleEntry[];

let index: MiniSearch<LegalRuleEntry> | null = null;

function getIndex(): MiniSearch<LegalRuleEntry> {
  if (index) return index;
  index = new MiniSearch<LegalRuleEntry>({
    idField: 'id',
    fields: ['title', 'excerpt', 'fullText', 'category'],
    storeFields: ['id', 'category', 'title', 'sourceType', 'url', 'fetchedAt', 'excerpt', 'fetchError'],
    searchOptions: { boost: { title: 3, excerpt: 1.5 }, prefix: true, fuzzy: 0.2 },
  });
  index.addAll(entries);
  return index;
}

/**
 * Fully offline full-text search over the bundled, periodically-refreshed legal-rules dataset
 * (src/data/legalRules.json). No network call happens here at all, at search time or otherwise.
 * `query` may be empty -- in that case every entry (optionally filtered by category) is returned,
 * sorted alphabetically.
 */
export function searchRules(query: string, options: { category?: string } = {}): LegalRuleEntry[] {
  const { category } = options;

  if (!query || !query.trim()) {
    return entries
      .filter((e) => !category || e.category === category)
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  return getIndex().search(query, {
    filter: category ? (result) => result.category === category : undefined,
  }) as unknown as LegalRuleEntry[];
}

export const allRuleEntries = entries;
