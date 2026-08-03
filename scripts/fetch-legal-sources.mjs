// scripts/fetch-legal-sources.mjs
//
// Refreshes src/data/legalRules.json from scripts/legal-sources-registry.json
// -- the ONLY two places this pipeline knows about official sources. Run by
// .github/workflows/fetch-legal-sources.yml on a schedule (and by
// `npm run fetch-legal-sources` locally), never invents a URL: every entry
// in the registry was hand-verified (India Code for bare acts, the relevant
// commission/tribunal's own official portal for everything else) before
// being added. This script's job is purely mechanical: fetch, extract, write.
//
// A single entry failing (site down, network hiccup) does NOT fail the whole
// run or wipe that entry's last-known-good data -- it keeps the previous
// successful fetch and records the error, so a transient outage on one
// government site never regresses the bundled offline dataset.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.join(__dirname, 'legal-sources-registry.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'legalRules.json');

const USER_AGENT =
  'VIDHANOS-legal-source-fetcher/1.0 (+https://github.com/akashbsp1997-bot/vidhanos) - offline legal-reference dataset builder';
const FETCH_TIMEOUT_MS = 30000;
const MAX_FULL_TEXT_CHARS = 20000; // keeps the bundled dataset (and repo size) sane -- an excerpt/summary, not necessarily the entire text
const EXCERPT_CHARS = 1200;

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { headers: { 'user-agent': USER_AGENT }, signal: controller.signal, redirect: 'follow' });
  } finally {
    clearTimeout(timer);
  }
}

async function extractFromResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());

  if (contentType.includes('pdf') || buf.slice(0, 4).toString('latin1') === '%PDF') {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buf });
    try {
      const parsed = await parser.getText();
      return parsed.text.replace(/\s+/g, ' ').trim();
    } finally {
      await parser.destroy();
    }
  }

  return stripHtml(buf.toString('utf8'));
}

async function fetchOne(entry) {
  const res = await fetchWithTimeout(entry.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await extractFromResponse(res);
  if (!text || text.length < 50) throw new Error('Fetched content was empty or too short to be real text');
  return text;
}

async function loadExisting() {
  try {
    const raw = await readFile(OUTPUT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function main() {
  const registry = JSON.parse(await readFile(REGISTRY_PATH, 'utf8'));
  const existingById = Object.fromEntries((await loadExisting()).map((e) => [e.id, e]));

  const results = [];
  for (const entry of registry) {
    process.stdout.write(`Fetching ${entry.id} (${entry.url})... `);
    try {
      const text = await fetchOne(entry);
      const fullText = text.slice(0, MAX_FULL_TEXT_CHARS);
      results.push({
        id: entry.id,
        category: entry.category,
        title: entry.title,
        sourceType: entry.sourceType,
        url: entry.citationUrl || entry.url,
        fetchedAt: new Date().toISOString(),
        excerpt: text.slice(0, EXCERPT_CHARS),
        fullText,
        fetchError: null,
      });
      console.log(`OK (${text.length} chars)`);
    } catch (err) {
      const previous = existingById[entry.id];
      results.push({
        id: entry.id,
        category: entry.category,
        title: entry.title,
        sourceType: entry.sourceType,
        url: entry.citationUrl || entry.url,
        fetchedAt: previous?.fetchedAt || null,
        excerpt: previous?.excerpt || '',
        fullText: previous?.fullText || '',
        fetchError: String(err.message).slice(0, 300),
      });
      console.log(`FAILED (${err.message}) -- keeping previous data if any`);
    }
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(results, null, 2) + '\n', 'utf8');
  console.log(`\nWrote ${results.length} entries to ${path.relative(process.cwd(), OUTPUT_PATH)}`);

  const failed = results.filter((r) => r.fetchError);
  if (failed.length) {
    console.log(`${failed.length} entr${failed.length === 1 ? 'y' : 'ies'} failed this run (kept prior data): ${failed.map((f) => f.id).join(', ')}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
