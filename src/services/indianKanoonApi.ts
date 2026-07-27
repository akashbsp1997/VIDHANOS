import { getIndianKanoonToken } from '@/services/secureConfig';

const BASE_URL = 'https://api.indiankanoon.org';

export interface IndianKanoonSearchDoc {
  tid: number;
  title: string;
  headline: string;
  docsource: string;
  publishdate: string;
  numcites?: number;
}

export interface IndianKanoonSearchResult {
  docs: IndianKanoonSearchDoc[];
  found: string;
}

export interface IndianKanoonDocMeta {
  tid: number;
  title: string;
  publishdate: string;
  docsource: string;
}

export interface IndianKanoonDoc extends IndianKanoonDocMeta {
  doc: string;
}

export class IndianKanoonAuthError extends Error {
  constructor(message = 'Indian Kanoon API key missing or invalid. Add it in Settings.') {
    super(message);
    this.name = 'IndianKanoonAuthError';
  }
}

async function apiPost<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const token = await getIndianKanoonToken();
  if (!token) throw new IndianKanoonAuthError();

  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${BASE_URL}${path}?${query}`, {
    method: 'POST',
    headers: { Authorization: `Token ${token}` },
  });

  if (response.status === 401 || response.status === 403) {
    throw new IndianKanoonAuthError();
  }
  if (!response.ok) {
    throw new Error(`Indian Kanoon request failed (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export async function searchJudgments(
  query: string,
  pagenum = 0
): Promise<IndianKanoonSearchResult> {
  return apiPost<IndianKanoonSearchResult>('/search/', { formInput: query, pagenum });
}

export async function getDocMeta(tid: number): Promise<IndianKanoonDocMeta> {
  return apiPost<IndianKanoonDocMeta>(`/docmeta/${tid}/`, {});
}

export async function getDoc(tid: number): Promise<IndianKanoonDoc> {
  return apiPost<IndianKanoonDoc>(`/doc/${tid}/`, {});
}

/** Returns the download URL + auth header needed to fetch the original scanned copy, when available. */
export async function getOrigDocDownload(
  tid: number
): Promise<{ url: string; headers: Record<string, string> }> {
  const token = await getIndianKanoonToken();
  if (!token) throw new IndianKanoonAuthError();
  return {
    url: `${BASE_URL}/origdoc/${tid}/`,
    headers: { Authorization: `Token ${token}` },
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function docSnippet(headline: string, maxLength = 240): string {
  const text = stripHtml(headline);
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
