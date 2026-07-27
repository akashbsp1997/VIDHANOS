import { db } from '@/db/client';
import { legalReferences } from '@/db/schema';
import type { LegalReference } from '@/types/db';

export const legalReferenceRepository = {
  async listAll(): Promise<LegalReference[]> {
    return db.select().from(legalReferences);
  },

  /** Simple keyword overlap match, used to ground AI guidance prompts. */
  async findRelevant(text: string, limit = 8): Promise<LegalReference[]> {
    const all = await legalReferenceRepository.listAll();
    const haystack = text.toLowerCase();

    const scored = all
      .map((ref) => {
        const keywords = (ref.appliesToKeywords ?? '').split(',').map((k) => k.trim().toLowerCase());
        const score = keywords.filter((keyword) => keyword && haystack.includes(keyword)).length;
        return { ref, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((entry) => entry.ref);
  },
};
