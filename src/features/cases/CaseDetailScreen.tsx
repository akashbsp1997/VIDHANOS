import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { casesRepo } from '@/db/repositories/casesRepo';
import { citationsRepo } from '@/db/repositories/citationsRepo';
import { documentsRepo } from '@/db/repositories/documentsRepo';
import { hearingsRepo } from '@/db/repositories/hearingsRepo';

const TABS = ['Overview', 'Hearings', 'Documents', 'Citations'] as const;
type Tab = (typeof TABS)[number];

export function CaseDetailScreen() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Overview');

  const caseData = useLiveQuery(() => (caseId ? casesRepo.get(caseId) : undefined), [caseId]);
  const hearings = useLiveQuery(() => (caseId ? hearingsRepo.listByCase(caseId) : []), [caseId]);
  const documents = useLiveQuery(() => (caseId ? documentsRepo.listByCase(caseId) : []), [caseId]);
  const citations = useLiveQuery(() => (caseId ? citationsRepo.listByCase(caseId) : []), [caseId]);

  if (!caseId || !caseData) return <Screen>{null}</Screen>;

  const onDeleteCase = async () => {
    if (!confirm('Delete this case? Hearings, documents, and citations linked to it will remain but be orphaned.')) return;
    await casesRepo.remove(caseId);
    navigate('/cases');
  };

  return (
    <Screen>
      <div className="screen-header">
        <h2 style={{ margin: '0 0 4px' }}>{caseData.title}</h2>
      </div>
      <div className="tab-bar">
        {TABS.map((t) => (
          <button key={t} type="button" className={`tab-button${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' ? (
        <div className="screen-header">
          <Row label="Client" value={caseData.client.name} />
          <Row label="Opponents" value={caseData.opponents.map((o) => o.name).join(', ') || '—'} />
          <Row label="Case type" value={caseData.caseType ?? '—'} />
          <Row label="Forum / Court" value={caseData.forumName ?? '—'} />
          <Row label="State / District" value={[caseData.courtState, caseData.courtDistrict].filter(Boolean).join(' / ') || '—'} />
          <Row label="Court complex" value={caseData.courtComplex ?? '—'} />
          <Row label="Judge" value={caseData.judgeName ?? '—'} />
          <Row label="CNR number" value={caseData.cnrNumber ?? '—'} />
          <Row label="Filing number" value={caseData.filingNumber ?? '—'} />
          <Row label="Filing date" value={caseData.filingDate ? format(new Date(caseData.filingDate), 'dd MMM yyyy') : '—'} />
          <Row label="Registration number" value={caseData.registrationNumber ?? '—'} />
          <Row label="Stage" value={caseData.stage ?? '—'} />
          <Row label="Status" value={caseData.caseStatus} />
          <Row label="Next hearing" value={caseData.nextHearingDate ? format(new Date(caseData.nextHearingDate), 'dd MMM yyyy') : '—'} />
          <Row label="Notes" value={caseData.notes ?? '—'} />

          <div className="btn-row" style={{ flexDirection: 'column', marginTop: 16 }}>
            <Link to={`/cases/${caseId}/edit`}>
              <Button label="Edit Case" />
            </Link>
            <Button label="Delete Case" variant="danger" onClick={onDeleteCase} />
          </div>
        </div>
      ) : null}

      {tab === 'Hearings' ? (
        <>
          <div className="screen-header">
            <Link to={`/cases/${caseId}/hearings/new`}>
              <Button label="Add Hearing" />
            </Link>
          </div>
          {hearings?.length === 0 ? (
            <EmptyState title="No hearings/orders yet" message="Add the next hearing date or a filing deadline." />
          ) : (
            hearings?.map((h) => (
              <ListRow
                key={h.id}
                title={h.orderSummary || h.purpose || (h.isDeadline ? 'Deadline' : 'Hearing')}
                subtitle={h.purpose && h.orderSummary ? h.purpose : h.orderType}
                meta={format(new Date(h.hearingDate), 'dd MMM yyyy')}
                to={`/cases/${caseId}/hearings/${h.id}/edit`}
              />
            ))
          )}
        </>
      ) : null}

      {tab === 'Documents' ? (
        <>
          <div className="screen-header">
            <Link to={`/cases/${caseId}/documents/upload`}>
              <Button label="Upload Document" />
            </Link>
          </div>
          {documents?.length === 0 ? (
            <EmptyState title="No documents yet" message="Upload receipts, applications, orders, or bills for this case." />
          ) : (
            documents?.map((d) => (
              <ListRow
                key={d.id}
                title={d.fileName}
                subtitle={d.fileType === 'pdf' ? `PDF · ${d.pageCount ?? '?'} pages` : 'Image'}
                meta={format(new Date(d.createdAt), 'dd MMM yyyy')}
                to={`/cases/${caseId}/documents/${d.id}`}
              />
            ))
          )}
        </>
      ) : null}

      {tab === 'Citations' ? (
        <>
          <div className="screen-header">
            <Link to={`/citations?caseId=${caseId}`}>
              <Button label="Search Citations" />
            </Link>
          </div>
          {citations?.length === 0 ? (
            <EmptyState title="No citations saved" message="Search Indian Kanoon for relevant judgments to cite." />
          ) : (
            citations?.map((c) => (
              <div key={c.id} className="list-row">
                <div>
                  <div className="list-row-title">{c.title}</div>
                  {c.court ? <div className="list-row-subtitle">{c.court}</div> : null}
                </div>
                {c.dateOfJudgment ? <div className="list-row-meta">{format(new Date(c.dateOfJudgment), 'dd MMM yyyy')}</div> : null}
              </div>
            ))
          )}
        </>
      ) : null}
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>{label}</div>
      <div style={{ fontSize: 15, marginTop: 2 }}>{value}</div>
    </div>
  );
}
