import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { OfflineBanner } from '@/components/OfflineBanner';
import { Screen } from '@/components/Screen';
import { documentAnalysesRepo } from '@/db/repositories/documentAnalysesRepo';
import { documentsRepo } from '@/db/repositories/documentsRepo';
import type { DocumentAnalysis, RecommendationItem } from '@/db/schema';
import { blobToBase64 } from '@/lib/base64';
import { runDocumentAnalysis } from '@/services/ai/aiGuidanceService';
import { GUIDANCE_DISCLAIMER } from '@/services/ai/guidancePrompt';
import { useIsOnline } from '@/services/network';

export function GuidanceDetailScreen() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const isOnline = useIsOnline();

  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isNew = analysisId?.startsWith('new:') ?? false;
  const documentId = isNew ? analysisId!.slice('new:'.length) : null;

  const runInitialAnalysis = useCallback(async () => {
    if (!documentId) return;
    setLoading(true);
    setError(null);
    try {
      const document = await documentsRepo.get(documentId);
      if (!document) throw new Error('Document not found.');
      if (!document.caseId) throw new Error('This document is not linked to a case yet.');

      let fileBase64: string | undefined;
      if (document.fileType === 'image' || document.fileType === 'pdf') {
        fileBase64 = await blobToBase64(document.fileBlob);
      }

      const result = await runDocumentAnalysis({
        documentId: document.id,
        caseId: document.caseId,
        fileName: document.fileName,
        fileBase64,
        mimeType: document.mimeType,
      });
      setAnalysis(result);
      navigate(`/guidance/${result.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  }, [documentId, navigate]);

  useEffect(() => {
    if (!analysisId) return;
    if (isNew) {
      if (!isOnline) {
        setLoading(false);
        return;
      }
      runInitialAnalysis();
      return;
    }
    documentAnalysesRepo.get(analysisId).then((existing) => {
      setAnalysis(existing ?? null);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId, isOnline]);

  const onSubmitAnswers = async () => {
    if (!analysis) return;
    setSubmitting(true);
    setError(null);
    try {
      const document = await documentsRepo.get(analysis.documentId);
      if (!document) throw new Error('Document not found.');
      if (!document.caseId) throw new Error('This document is not linked to a case yet.');

      let fileBase64: string | undefined;
      if (document.fileType === 'image' || document.fileType === 'pdf') {
        fileBase64 = await blobToBase64(document.fileBlob);
      }

      const result = await runDocumentAnalysis({
        documentId: document.id,
        caseId: document.caseId,
        fileName: document.fileName,
        fileBase64,
        mimeType: document.mimeType,
        priorAnalysisId: analysis.id,
        userAnswers: answers,
      });
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isNew && !isOnline) {
    return (
      <Screen>
        <OfflineBanner />
        <EmptyState title="AI Guidance needs an internet connection" message="Reconnect and try again." />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen>
        <EmptyState title="Analyzing…" message="This may take a few seconds." />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <div className="screen-header">
          <EmptyState title="Couldn't complete analysis" message={error} />
          <Button label="Retry" onClick={runInitialAnalysis} />
        </div>
      </Screen>
    );
  }

  if (!analysis) {
    return (
      <Screen>
        <EmptyState title="No analysis found" />
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="screen-header">
        <div className="banner-warning" style={{ margin: '0 0 8px' }}>
          {GUIDANCE_DISCLAIMER}
        </div>
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Analyzed with Gemini (online)
        </p>

        {analysis.issueSummary ? (
          <Section title="Issue summary">
            <p style={{ fontSize: 14, lineHeight: 1.5 }}>{analysis.issueSummary}</p>
          </Section>
        ) : null}

        {analysis.status === 'needs_clarification' && analysis.clarifyingQuestions?.length ? (
          <Section title="A few questions before I can recommend next steps">
            {analysis.clarifyingQuestions.map((question) => (
              <div key={question} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{question}</label>
                <textarea
                  className="field-textarea"
                  value={answers[question] ?? ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [question]: e.target.value }))}
                />
              </div>
            ))}
            {!isOnline ? (
              <OfflineBanner />
            ) : (
              <Button label="Submit Answers" onClick={onSubmitAnswers} loading={submitting} />
            )}
          </Section>
        ) : null}

        {analysis.recommendedDepartments?.length ? (
          <RecommendationSection title="Relevant departments" items={analysis.recommendedDepartments} />
        ) : null}
        {analysis.recommendedMechanisms?.length ? (
          <RecommendationSection title="Legal mechanisms" items={analysis.recommendedMechanisms} />
        ) : null}
        {analysis.recommendedForums?.length ? (
          <RecommendationSection title="Judicial / extrajudicial forums" items={analysis.recommendedForums} />
        ) : null}

        {analysis.nextSteps?.length ? (
          <Section title="Suggested next steps">
            {analysis.nextSteps.map((step, index) => (
              <p key={index} style={{ fontSize: 13, marginBottom: 6, lineHeight: 1.4 }}>
                {index + 1}. {step}
              </p>
            ))}
          </Section>
        ) : null}
      </div>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function RecommendationSection({ title, items }: { title: string; items: RecommendationItem[] }) {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <div key={index} className="recommendation-row">
          <div className="recommendation-name">{item.name}</div>
          <div className="recommendation-reason">{item.reason}</div>
        </div>
      ))}
    </Section>
  );
}
