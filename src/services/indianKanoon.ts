import { settingsRepo } from '@/db/repositories/settingsRepo';

const BASE_URL = 'https://api.indiankanoon.org';

export interface IndianKanoonSearchDoc {
  tid: number;
  title: string;
  headline: string;
  docsource: string;
  publishdate: string;
}

export interface IndianKanoonSearchResult {
  docs: IndianKanoonSearchDoc[];
}

export class IndianKanoonUnavailableError extends Error {
  constructor(message = 'Indian Kanoon search is not available from this browser.') {
    super(message);
    this.name = 'IndianKanoonUnavailableError';
  }
}

/**
 * A CORS block and a network error are indistinguishable at the fetch() call site in a
 * browser (both surface as a generic TypeError, no status code) — so any failure here is
 * treated the same way by callers: fall back to manual search/entry.
 */
export async function searchIndianKanoon(query: string): Promise<IndianKanoonSearchDoc[]> {
  const token = await settingsRepo.getIndianKanoonToken();
  if (!token) throw new IndianKanoonUnavailableError('No Indian Kanoon API token configured. Add one in Settings.');

  try {
    const response = await fetch(`${BASE_URL}/search/?formInput=${encodeURIComponent(query)}`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
    });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const result = (await response.json()) as IndianKanoonSearchResult;
    return result.docs ?? [];
  } catch {
    throw new IndianKanoonUnavailableError();
  }
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function indianKanoonSearchUrl(query: string): string {
  return `https://indiankanoon.org/search/?formInput=${encodeURIComponent(query)}`;
}
