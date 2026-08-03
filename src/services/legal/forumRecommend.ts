import legalForumsData from '@/data/legalForums.json';

export interface LegalForum {
  id: string;
  name: string;
  forumType: string;
  level: string;
  description: string;
  pecuniaryMin: number | null;
  pecuniaryMax: number | null;
  subjectTags: string[];
  caseTypeTags: string[];
  appealsTo: string | null;
  notes: string;
}

export interface CaseFacts {
  caseType?: string;
  subjectMatter?: string;
  claimAmount?: number;
}

export interface ForumRecommendation {
  forum: LegalForum;
  score: number;
  reasons: string[];
  eligible: boolean;
}

const legalForums = legalForumsData as LegalForum[];

const CASE_TYPE_MATCH_SCORE = 40;
const SUBJECT_TAG_MATCH_SCORE = 25;
const PECUNIARY_FIT_SCORE = 20;
const PECUNIARY_UNKNOWN_PENALTY = 5;

function normalizeTag(s: string | undefined): string {
  return (s || '').toLowerCase().trim();
}

function subjectMatches(subjectMatter: string | undefined, subjectTags: string[] | undefined): string[] {
  const text = normalizeTag(subjectMatter);
  if (!text || !subjectTags?.length) return [];
  return subjectTags.filter((tag) => {
    const t = normalizeTag(tag);
    return t && (text.includes(t) || t.includes(text));
  });
}

function pecuniaryFit(
  claimAmount: number | undefined,
  pecuniaryMin: number | null | undefined,
  pecuniaryMax: number | null | undefined
): { fits: boolean | null; min: number; max: number } {
  if (claimAmount == null) return { fits: null, min: pecuniaryMin ?? 0, max: pecuniaryMax ?? Infinity };
  const min = pecuniaryMin ?? 0;
  const max = pecuniaryMax ?? Infinity;
  return { fits: claimAmount >= min && claimAmount <= max, min, max };
}

function formatRange(min: number, max: number): string {
  const lo = min ? `above ${min.toLocaleString('en-IN')}` : 'no floor';
  const hi = max && max !== Infinity ? `up to ${max.toLocaleString('en-IN')}` : 'no ceiling';
  return `${lo}, ${hi}`;
}

/**
 * Deterministic, rule-based forum/court recommendation — NOT an AI call, works fully offline.
 * Scores the bundled forum catalog against the case's own facts and returns a ranked list with
 * the exact reasons behind each score, so a wrong-forum mistake (real consequences: limitation
 * periods, refiling costs) is transparent and inspectable rather than a plausible-sounding guess.
 */
export function recommendForums(caseFacts: CaseFacts, forums: LegalForum[] = legalForums): ForumRecommendation[] {
  const { caseType, subjectMatter, claimAmount } = caseFacts;

  return forums
    .map((forum) => {
      let score = 0;
      const reasons: string[] = [];
      const caseTypeTags = forum.caseTypeTags || [];
      const eligible = !caseType || caseTypeTags.length === 0 || caseTypeTags.includes(caseType);

      if (caseType && caseTypeTags.includes(caseType)) {
        score += CASE_TYPE_MATCH_SCORE;
        reasons.push(`Handles "${caseType.replace(/_/g, ' ')}" matters`);
      } else if (caseType && caseTypeTags.length > 0) {
        reasons.push(`Does not typically handle "${caseType.replace(/_/g, ' ')}" matters`);
      }

      const matchedTags = subjectMatches(subjectMatter, forum.subjectTags);
      if (matchedTags.length) {
        score += SUBJECT_TAG_MATCH_SCORE;
        reasons.push(`Subject matches: ${matchedTags.join(', ')}`);
      }

      if (forum.pecuniaryMin != null || forum.pecuniaryMax != null) {
        const { fits, min, max } = pecuniaryFit(claimAmount, forum.pecuniaryMin, forum.pecuniaryMax);
        if (fits === true) {
          score += PECUNIARY_FIT_SCORE;
          reasons.push(`Claim amount fits its pecuniary range (${formatRange(min, max)})`);
        } else if (fits === false) {
          reasons.push(`Claim amount falls outside its pecuniary range (${formatRange(min, max)})`);
        } else {
          score -= PECUNIARY_UNKNOWN_PENALTY;
          reasons.push("Claim amount not given — pecuniary fit can't be checked yet");
        }
      }

      if (!eligible) score -= 100;

      return { forum, score, reasons, eligible };
    })
    .sort((a, b) => b.score - a.score);
}
