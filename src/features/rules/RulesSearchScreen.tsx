import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';
import { LEGAL_RULE_CATEGORIES } from '@/lib/legalEnums';
import { searchRules } from '@/services/legal/rulesSearch';

export function RulesSearchScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const results = useMemo(() => searchRules(query, { category: category || undefined }), [query, category]);

  return (
    <Screen>
      <div className="screen-header">
        <h2 style={{ margin: '0 0 4px' }}>Rules &amp; Regulations</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>
          Search a bundled, offline set of official acts and regulator portals — refreshed periodically from
          government sources. Not a substitute for verifying the current text yourself. Works with no connection.
        </p>
        <SelectField
          label="Category"
          placeholder="All categories"
          options={LEGAL_RULE_CATEGORIES}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. consumer, divorce, service matter, human rights"
        />
      </div>

      {results.length === 0 ? (
        <EmptyState title="No matches" message="Try a different search term or category." />
      ) : (
        results.map((r) => (
          <div key={r.id} className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
            <div className="list-row-title">{r.title}</div>
            <div className="list-row-subtitle">
              {LEGAL_RULE_CATEGORIES.find((c) => c.value === r.category)?.label || r.category} ·{' '}
              {r.sourceType.replace(/_/g, ' ')}
            </div>
            {r.excerpt ? (
              <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>{r.excerpt}…</p>
            ) : (
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
                {r.fetchError || 'Not fetched yet.'}
              </p>
            )}
            <p style={{ fontSize: 12, margin: 0 }}>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                Open official source ↗
              </a>
              {r.fetchedAt ? (
                <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>
                  Last refreshed {new Date(r.fetchedAt).toLocaleDateString('en-IN')}
                </span>
              ) : null}
            </p>
          </div>
        ))
      )}
    </Screen>
  );
}
