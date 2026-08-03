import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { casesRepo, type CaseWithRelations } from '@/db/repositories/casesRepo';
import { draftsRepo } from '@/db/repositories/draftsRepo';
import type { Draft } from '@/db/schema';
import { LEGAL_DRAFT_TYPES } from '@/lib/legalEnums';
import { aiDraft } from '@/services/ai/draftService';
import { renderTemplateDraft } from '@/services/drafting/draftTemplates';
import { useIsOnline } from '@/services/network';
import { settingsRepo } from '@/db/repositories/settingsRepo';

export function DraftEditorScreen() {
  const { caseId, draftId } = useParams<{ caseId: string; draftId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isOnline = useIsOnline();
  const isNew = !draftId;

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState<CaseWithRelations | null>(null);
  const [draftType, setDraftType] = useState(searchParams.get('type') || 'other');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Draft['status']>('draft');
  const [causeOfAction, setCauseOfAction] = useState('');
  const [description, setDescription] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [instructions, setInstructions] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!caseId) return;
    Promise.all([casesRepo.get(caseId), settingsRepo.getGeminiApiKey(), draftId ? draftsRepo.get(draftId) : null]).then(
      ([c, key, existingDraft]) => {
        setCaseData(c ?? null);
        setHasKey(Boolean(key));
        if (existingDraft) {
          setDraftType(existingDraft.draftType);
          setTitle(existingDraft.title);
          setContent(existingDraft.content);
          setStatus(existingDraft.status);
        } else if (c) {
          const typeLabel = LEGAL_DRAFT_TYPES.find((t) => t.value === draftType)?.label ?? draftType;
          setTitle(`${typeLabel} (offline template)`);
          setContent(renderTemplateDraft(draftType, c, {}));
        }
        setLoading(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, draftId]);

  const onRegenerateTemplate = () => {
    if (!caseData) return;
    const amount = Number(claimAmount.replace(/[^\d.]/g, ''));
    setContent(
      renderTemplateDraft(draftType, caseData, {
        causeOfAction: causeOfAction.trim() || undefined,
        description: description.trim() || undefined,
        claimAmount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
      })
    );
    const typeLabel = LEGAL_DRAFT_TYPES.find((t) => t.value === draftType)?.label ?? draftType;
    setTitle(`${typeLabel} (offline template)`);
  };

  const onImproveWithAi = async () => {
    if (!caseData) return;
    setAiBusy(true);
    setAiNotice(null);
    try {
      const amount = Number(claimAmount.replace(/[^\d.]/g, ''));
      const result = await aiDraft({
        draftType,
        caseData,
        facts: {
          causeOfAction: causeOfAction.trim() || undefined,
          description: description.trim() || undefined,
          claimAmount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
        },
        instructions: instructions.trim() || undefined,
        existingContent: content.trim() || undefined,
      });
      setTitle(result.title);
      setContent(result.content);
    } catch (err) {
      setAiNotice(err instanceof Error ? err.message : 'Could not reach AI — the current draft is unchanged.');
    } finally {
      setAiBusy(false);
    }
  };

  const onSave = async () => {
    if (!caseId || !title.trim() || !content.trim()) return;
    setSaving(true);
    if (isNew) {
      const created = await draftsRepo.create({ caseId, draftType, title: title.trim(), content, status });
      navigate(`/cases/${caseId}/drafts/${created.id}`);
    } else if (draftId) {
      await draftsRepo.update(draftId, { title: title.trim(), content, status });
      navigate(`/cases/${caseId}`);
    }
    setSaving(false);
  };

  const onDelete = async () => {
    if (!draftId) return;
    if (!confirm('Delete this draft?')) return;
    await draftsRepo.remove(draftId);
    navigate(`/cases/${caseId}`);
  };

  if (loading || !caseData) return <Screen>{null}</Screen>;

  return (
    <Screen>
      <div className="screen-header">
        <h2 style={{ margin: '0 0 12px' }}>{isNew ? 'New Draft' : 'Edit Draft'}</h2>

        {isNew ? (
          <>
            <TextField label="Cause of action" multiline value={causeOfAction} onChange={(e) => setCauseOfAction(e.target.value)} />
            <TextField label="Facts / description" multiline value={description} onChange={(e) => setDescription(e.target.value)} />
            <TextField label="Claim amount, if any (₹, optional)" value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} />
            <Button label="Regenerate template" variant="secondary" onClick={onRegenerateTemplate} />
          </>
        ) : null}

        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Content" multiline value={content} onChange={(e) => setContent(e.target.value)} />

        {hasKey && isOnline ? (
          <>
            <TextField
              label="AI polish instructions (optional)"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. tighten the language, add a limitation-period note"
            />
            <Button label="Improve with AI" variant="secondary" onClick={onImproveWithAi} loading={aiBusy} />
            {aiNotice ? <div className="banner-warning" style={{ margin: '8px 0' }}>{aiNotice}</div> : null}
          </>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {isOnline ? 'Add a Gemini API key in Settings to enable an optional AI polish pass.' : 'AI polish needs a connection.'}
          </p>
        )}

        <div className="btn-row" style={{ flexDirection: 'column', marginTop: 12 }}>
          <Button
            label={status === 'final' ? 'Mark as Draft' : 'Mark as Final'}
            variant="secondary"
            onClick={() => setStatus(status === 'final' ? 'draft' : 'final')}
          />
          <Button label="Save" onClick={onSave} loading={saving} disabled={!title.trim() || !content.trim()} />
          {!isNew ? <Button label="Delete" variant="danger" onClick={onDelete} /> : null}
        </div>
      </div>
    </Screen>
  );
}
