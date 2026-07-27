import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { OfflineBanner } from '@/components/OfflineBanner';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { citationsRepo } from '@/db/repositories/citationsRepo';
import { indianKanoonSearchUrl, searchIndianKanoon, stripHtml, type IndianKanoonSearchDoc } from '@/services/indianKanoon';
import { useIsOnline } from '@/services/network';

export function CitationSearchScreen() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId') ?? undefined;
  const isOnline = useIsOnline();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IndianKanoonSearchDoc[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const onSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setUnavailable(false);
    setResults(null);
    try {
      const docs = await searchIndianKanoon(query.trim());
      setResults(docs);
    } catch {
      setUnavailable(true);
    } finally {
      setLoading(false);
    }
  };

  const onSaveResult = async (doc: IndianKanoonSearchDoc) => {
    await citationsRepo.create({
      caseId,
      indianKanoonDocId: String(doc.tid),
      title: doc.title,
      court: doc.docsource,
      dateOfJudgment: doc.publishdate ? Date.parse(doc.publishdate) || undefined : undefined,
      snippet: stripHtml(doc.headline),
      sourceUrl: `https://indiankanoon.org/doc/${doc.tid}/`,
      addedManually: 0,
    });
    setSavedIds((prev) => new Set(prev).add(doc.tid));
  };

  if (!isOnline) {
    return (
      <Screen>
        <OfflineBanner />
        <ManualCitationForm caseId={caseId} prefillQuery={query} />
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="screen-header">
        <TextField
          label="Search Indian Kanoon"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. deficiency of service consumer"
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <Button label="Search" onClick={onSearch} loading={loading} />
      </div>

      {unavailable ? (
        <div className="screen-header">
          <div className="banner-warning" style={{ margin: '0 0 12px' }}>
            Indian Kanoon search isn't available from this browser (likely a cross-origin restriction, or no API
            token configured in Settings). Search manually instead:
          </div>
          <a href={indianKanoonSearchUrl(query)} target="_blank" rel="noopener noreferrer">
            <Button label="Search on indiankanoon.org ↗" variant="secondary" />
          </a>
          <ManualCitationForm caseId={caseId} prefillQuery={query} />
        </div>
      ) : null}

      {results && !unavailable ? (
        results.length === 0 ? (
          <EmptyState title="No results" message="Try a different search term." />
        ) : (
          results.map((doc) => (
            <div key={doc.tid} className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
              <div className="list-row-title">{doc.title}</div>
              <div className="list-row-subtitle">
                {doc.docsource} {doc.publishdate ? `· ${doc.publishdate}` : ''}
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>{stripHtml(doc.headline)}</p>
              <Button
                label={savedIds.has(doc.tid) ? 'Saved ✓' : caseId ? 'Save to Case' : 'Open a case to save'}
                variant="secondary"
                disabled={savedIds.has(doc.tid) || !caseId}
                onClick={() => onSaveResult(doc)}
              />
            </div>
          ))
        )
      ) : null}

      {!results && !unavailable && !loading ? (
        <EmptyState title="Search for judgments to cite" message="Results from Indian Kanoon will appear here." />
      ) : null}
    </Screen>
  );
}

function ManualCitationForm({ caseId, prefillQuery }: { caseId?: string; prefillQuery: string }) {
  const [title, setTitle] = useState(prefillQuery);
  const [court, setCourt] = useState('');
  const [snippet, setSnippet] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [saved, setSaved] = useState(false);

  const onSave = async () => {
    if (!title.trim()) return;
    await citationsRepo.create({
      caseId,
      title: title.trim(),
      court: court.trim() || undefined,
      snippet: snippet.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      addedManually: 1,
    });
    setSaved(true);
  };

  return (
    <div className="section" style={{ margin: '16px 0 0' }}>
      <p className="section-title">Add citation manually</p>
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="Court" value={court} onChange={(e) => setCourt(e.target.value)} />
      <TextField label="Snippet / notes" multiline value={snippet} onChange={(e) => setSnippet(e.target.value)} />
      <TextField label="Source URL" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
      <Button
        label={saved ? 'Saved ✓' : caseId ? 'Save to Case' : 'Open a case to save'}
        onClick={onSave}
        disabled={saved || !caseId || !title.trim()}
      />
    </div>
  );
}
