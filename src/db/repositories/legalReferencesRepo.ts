import { db, type LegalReference } from '../schema';

export const legalReferencesRepo = {
  listAll(): Promise<LegalReference[]> {
    return db.legalReferences.toArray();
  },

  /** Simple keyword overlap match, used to ground AI guidance prompts. */
  async findRelevant(text: string, limit = 8): Promise<LegalReference[]> {
    const all = await legalReferencesRepo.listAll();
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
