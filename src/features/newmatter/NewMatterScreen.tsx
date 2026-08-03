import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/Button';
import { OfflineBanner } from '@/components/OfflineBanner';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { casesRepo } from '@/db/repositories/casesRepo';
import { clientsRepo } from '@/db/repositories/clientsRepo';
import { documentAnalysesRepo } from '@/db/repositories/documentAnalysesRepo';
import { documentsRepo } from '@/db/repositories/documentsRepo';
import { opponentsRepo } from '@/db/repositories/opponentsRepo';
import type { Client, Opponent, RecommendationItem } from '@/db/schema';
import { blobToBase64 } from '@/lib/base64';
import { generateId } from '@/lib/ids';
import { isGuidanceAvailable } from '@/services/ai/aiGuidanceService';
import { runInitialIntakeAnalysis, runIntakeFollowUp } from '@/services/ai/intakeService';
import { extractExif, type ExifData } from '@/services/fileMetadata/exifMeta';
import { extractPdfMetadata, type PdfMetadata } from '@/services/fileMetadata/pdfMeta';
import { generateImageThumbnail } from '@/services/fileMetadata/thumbnail';
import { extractDocumentText } from '@/services/ocr';
import { recommendForums } from '@/services/legal/forumRecommend';
import { useIsOnline } from '@/services/network';

type Step = 'upload' | 'incident' | 'forum-parties';

interface PendingDocument {
  file: File;
  fileType: 'image' | 'pdf';
  pdfMeta: PdfMetadata | null;
  exifMeta: ExifData | null;
  previewUrl: string | null;
}

export function NewMatterScreen() {
  const navigate = useNavigate();
  const isOnline = useIsOnline();

  const [step, setStep] = useState<Step>('upload');
  const [processing, setProcessing] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const [pending, setPending] = useState<PendingDocument | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [aiAvailable, setAiAvailable] = useState(false);

  const [issueSummary, setIssueSummary] = useState('');
  const [userIntent, setUserIntent] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [claimAmount, setClaimAmount] = useState('');

  const [caseTitle, setCaseTitle] = useState('');
  const [caseType, setCaseType] = useState('');
  const [forumName, setForumName] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [opponentNames, setOpponentNames] = useState<string[]>(['']);
  const [recommendedForums, setRecommendedForums] = useState<RecommendationItem[]>([]);
  const [recommendedMechanisms, setRecommendedMechanisms] = useState<RecommendationItem[]>([]);
  const [recommendedDepartments, setRecommendedDepartments] = useState<RecommendationItem[]>([]);
  const [nextSteps, setNextSteps] = useState<string[]>([]);

  const [clients, setClients] = useState<Client[]>([]);
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [creating, setCreating] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([clientsRepo.list(), opponentsRepo.list()]).then(([c, o]) => {
      setClients(c);
      setOpponents(o);
    });
  }, []);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setProcessing(true);
    setAiNotice(null);

    const fileType: 'image' | 'pdf' = file.type === 'application/pdf' ? 'pdf' : 'image';
    const pdfMeta = fileType === 'pdf' ? await extractPdfMetadata(file) : null;
    const exifMeta = fileType === 'image' ? await extractExif(file) : null;
    const previewUrl = fileType === 'image' ? URL.createObjectURL(file) : null;
    const ocrResult = await extractDocumentText(file, fileType);
    setPending({ file, fileType, pdfMeta, exifMeta, previewUrl });
    setExtractedText(ocrResult?.text ?? '');

    const newDocumentId = generateId();
    const thumbnailBlob = fileType === 'image' ? await generateImageThumbnail(file) : undefined;
    await documentsRepo.create({
      id: newDocumentId,
      caseId: undefined,
      fileName: file.name || (fileType === 'pdf' ? 'document.pdf' : 'photo.jpg'),
      fileBlob: file,
      thumbnailBlob,
      fileType,
      mimeType: file.type,
      fileSizeBytes: file.size,
      pageCount: pdfMeta?.pageCount,
      pdfTitle: pdfMeta?.title ?? undefined,
      pdfAuthor: pdfMeta?.author ?? undefined,
      pdfCreatedAt: pdfMeta?.createdAt ?? undefined,
      pdfModifiedAt: pdfMeta?.modifiedAt ?? undefined,
      exifTakenAt: exifMeta?.takenAt ?? undefined,
      exifGpsLat: exifMeta?.gpsLat ?? undefined,
      exifGpsLng: exifMeta?.gpsLng ?? undefined,
      exifCameraModel: exifMeta?.cameraModel ?? undefined,
      extractedText: ocrResult?.text || undefined,
      ocrConfidence: ocrResult?.confidence ?? undefined,
    });
    setDocumentId(newDocumentId);

    const available = await isGuidanceAvailable(isOnline);
    setAiAvailable(available);

    if (available) {
      try {
        const fileBase64 = await blobToBase64(file);
        const analysis = await runInitialIntakeAnalysis({
          documentId: newDocumentId,
          fileName: file.name,
          fileBase64,
          mimeType: file.type,
        });
        setAnalysisId(analysis.id);
        setIssueSummary(analysis.issueSummary ?? '');
        setCaseType(analysis.suggestedCaseType ?? '');
      } catch (err) {
        setAiNotice(err instanceof Error ? err.message : 'Could not reach AI — continuing with manual entry.');
      }
    } else if (ocrResult?.text) {
      // No AI available — pre-fill the incident description from on-device OCR text instead of leaving it blank.
      setIssueSummary(ocrResult.text.slice(0, 500));
    }

    setProcessing(false);
    setStep('incident');
  };

  const onContinueFromIncident = async () => {
    if (!userIntent.trim()) return;
    setProcessing(true);
    setAiNotice(null);

    if (aiAvailable && analysisId) {
      try {
        const result = await runIntakeFollowUp({
          analysisId,
          fileName: pending?.file.name ?? 'document',
          confirmedSummary: issueSummary,
          userIntent: userIntent.trim(),
        });
        setCaseTitle(result.suggestedCaseTitle ?? '');
        setApplicantName(result.suggestedApplicantName ?? '');
        setOpponentNames(result.suggestedOpponentNames?.length ? result.suggestedOpponentNames : ['']);
        setRecommendedForums(result.recommendedForums ?? []);
        setRecommendedMechanisms(result.recommendedMechanisms ?? []);
        setRecommendedDepartments(result.recommendedDepartments ?? []);
        setNextSteps(result.nextSteps ?? []);
        if (result.recommendedForums?.[0]) setForumName(result.recommendedForums[0].name);
      } catch (err) {
        setAiNotice(err instanceof Error ? err.message : 'Could not reach AI — continuing with manual entry.');
      }
    } else {
      // No AI available — fall back to a deterministic, rule-based forum suggestion (zero network).
      const parsedAmount = Number(claimAmount.replace(/[^\d.]/g, ''));
      const scored = recommendForums({
        caseType: caseType.trim() || undefined,
        subjectMatter: `${issueSummary} ${extractedText} ${userIntent}`.trim(),
        claimAmount: Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : undefined,
      });
      const suggestions = scored
        .filter((r) => r.eligible && r.score > 0)
        .slice(0, 5)
        .map((r) => ({ name: r.forum.name, reason: r.reasons.join('; ') || r.forum.description }));
      setRecommendedForums(suggestions);
      if (suggestions[0]) setForumName(suggestions[0].name);
      if (!caseTitle.trim() && issueSummary.trim()) setCaseTitle(issueSummary.trim().slice(0, 80));
    }

    setProcessing(false);
    setStep('forum-parties');
  };

  const resolvePartyId = async (
    name: string,
    existing: Array<{ id: string; name: string }>,
    createFn: (input: { name: string }) => Promise<{ id: string }>
  ): Promise<string | null> => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const match = existing.find((e) => e.name.trim().toLowerCase() === trimmed.toLowerCase());
    if (match) return match.id;
    const created = await createFn({ name: trimmed });
    return created.id;
  };

  const onCreateCase = async () => {
    if (!applicantName.trim() || !caseTitle.trim() || !documentId) return;
    setCreating(true);

    const clientId = await resolvePartyId(applicantName, clients, clientsRepo.create);
    if (!clientId) {
      setCreating(false);
      return;
    }

    const opponentIds: string[] = [];
    for (const name of opponentNames) {
      const id = await resolvePartyId(name, opponents, opponentsRepo.create);
      if (id) opponentIds.push(id);
    }

    const newCase = await casesRepo.create(
      {
        title: caseTitle.trim(),
        caseType: caseType.trim() || undefined,
        forumName: forumName.trim() || undefined,
        clientId,
        caseStatus: 'pending',
        priority: 'normal',
        notes: nextSteps.length ? `Suggested next steps:\n${nextSteps.map((s) => `- ${s}`).join('\n')}` : undefined,
      },
      opponentIds
    );

    await documentsRepo.assignToCase(documentId, newCase.id);
    if (analysisId) await documentAnalysesRepo.assignToCase(analysisId, newCase.id);

    const query = `${caseType} ${issueSummary}`.trim().slice(0, 150);
    navigate(`/citations?caseId=${newCase.id}${query ? `&q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <Screen>
      <div className="screen-header">
        <h2 style={{ margin: '0 0 12px' }}>New Matter</h2>

        {step === 'upload' ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12 }}>
              Upload a receipt, notice, order, or any document about the incident to get started.
            </p>
            <div className="btn-row" style={{ flexDirection: 'column' }}>
              <Button label="Take Photo" onClick={() => cameraInputRef.current?.click()} loading={processing} />
              <Button
                label="Choose File (image or PDF)"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                loading={processing}
              />
            </div>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </>
        ) : null}

        {step === 'incident' ? (
          <>
            {pending?.previewUrl ? (
              <img src={pending.previewUrl} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} />
            ) : null}
            {!isOnline ? (
              <OfflineBanner />
            ) : !aiAvailable ? (
              <div className="banner-warning" style={{ margin: '0 0 12px' }}>
                No Gemini API key configured — add one in Settings to have AI read documents automatically.
                Continuing with manual entry for now.
              </div>
            ) : null}
            {aiNotice ? <div className="banner-warning" style={{ margin: '0 0 12px' }}>{aiNotice}</div> : null}
            <TextField
              label={aiAvailable ? 'Here is the incident as I read it — edit if needed' : 'Describe what happened'}
              multiline
              value={issueSummary}
              onChange={(e) => setIssueSummary(e.target.value)}
              placeholder="Describe the incident..."
            />
            <TextField
              label="What do you want to do about it?"
              multiline
              value={userIntent}
              onChange={(e) => setUserIntent(e.target.value)}
              placeholder="e.g. Get a refund, file a complaint, seek compensation…"
            />
            <TextField
              label="Claim amount, if any (₹, optional)"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              placeholder="e.g. 50000"
            />
            <Button label="Continue" onClick={onContinueFromIncident} loading={processing} disabled={!userIntent.trim()} />
          </>
        ) : null}

        {step === 'forum-parties' ? (
          <>
            {aiNotice ? <div className="banner-warning" style={{ margin: '0 0 12px' }}>{aiNotice}</div> : null}
            <TextField label="Case title" value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} />
            <TextField label="Case type" value={caseType} onChange={(e) => setCaseType(e.target.value)} />

            {recommendedForums.length > 0 ? (
              <div className="field">
                <span className="field-label">Suggested forum / authority</span>
                {recommendedForums.map((f, i) => (
                  <div key={i} className="recommendation-row" style={{ cursor: 'pointer' }} onClick={() => setForumName(f.name)}>
                    <div className="recommendation-name">{f.name}</div>
                    <div className="recommendation-reason">{f.reason}</div>
                  </div>
                ))}
              </div>
            ) : null}
            <TextField label="Forum / Court / Authority" value={forumName} onChange={(e) => setForumName(e.target.value)} />

            {recommendedMechanisms.length > 0 || recommendedDepartments.length > 0 ? (
              <div className="field">
                <span className="field-label">For reference</span>
                {[...recommendedMechanisms, ...recommendedDepartments].map((r, i) => (
                  <div key={i} className="recommendation-row">
                    <div className="recommendation-name">{r.name}</div>
                    <div className="recommendation-reason">{r.reason}</div>
                  </div>
                ))}
              </div>
            ) : null}

            <TextField
              label="Applicant / client name"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Who is bringing this matter?"
            />

            <div className="field">
              <span className="field-label">Opponent(s)</span>
              {opponentNames.map((name, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    className="field-input"
                    value={name}
                    onChange={(e) => {
                      const next = [...opponentNames];
                      next[i] = e.target.value;
                      setOpponentNames(next);
                    }}
                    placeholder="Opponent name"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: 'auto' }}
                    onClick={() => setOpponentNames(opponentNames.filter((_, idx) => idx !== i))}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <Button label="+ Add opponent" variant="secondary" onClick={() => setOpponentNames([...opponentNames, ''])} />
            </div>

            <Button
              label="Create Case"
              onClick={onCreateCase}
              loading={creating}
              disabled={!caseTitle.trim() || !applicantName.trim()}
            />
          </>
        ) : null}
      </div>
    </Screen>
  );
}
