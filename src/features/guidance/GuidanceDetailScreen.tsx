import { File } from 'expo-file-system';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { documentAnalysisRepository } from '@/db/repositories/documentAnalysisRepository';
import { documentRepository } from '@/db/repositories/documentRepository';
import type { RootStackScreenProps } from '@/navigation/types';
import { GUIDANCE_DISCLAIMER } from '@/services/ai/aiProvider';
import { runDocumentAnalysis } from '@/services/ai/aiGuidanceService';
import { resolveUri } from '@/services/fileStorage';
import { useIsOnline } from '@/services/network';
import { colors } from '@/theme/colors';
import type { RecommendationItem } from '@/db/schema';
import type { DocumentAnalysis as DocumentAnalysisRow } from '@/types/db';

type Props = RootStackScreenProps<'GuidanceDetail'>;

export function GuidanceDetailScreen({ route, navigation }: Props) {
  const { analysisId } = route.params;
  const isOnline = useIsOnline();

  const [analysis, setAnalysis] = useState<DocumentAnalysisRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isNew = analysisId.startsWith('new:');
  const documentId = isNew ? analysisId.slice('new:'.length) : null;

  const runInitialAnalysis = useCallback(async () => {
    if (!documentId) return;
    setLoading(true);
    setError(null);
    try {
      const document = await documentRepository.get(documentId);
      if (!document) throw new Error('Document not found.');

      let fileBase64: string | undefined;
      if (document.fileType === 'image' || document.fileType === 'pdf') {
        const uri = resolveUri(document.fileUri);
        fileBase64 = await new File(uri).base64();
      }

      const result = await runDocumentAnalysis({
        documentId: document.id,
        caseId: document.caseId,
        fileName: document.fileName,
        fileBase64,
        mimeType: document.mimeType,
        isOnline,
      });
      setAnalysis(result);
      navigation.setParams({ analysisId: result.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  }, [documentId, isOnline, navigation]);

  useEffect(() => {
    if (isNew) {
      runInitialAnalysis();
      return;
    }
    documentAnalysisRepository.get(analysisId).then((existing) => {
      setAnalysis(existing ?? null);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId]);

  const onSubmitAnswers = async () => {
    if (!analysis) return;
    setSubmitting(true);
    setError(null);
    try {
      const document = await documentRepository.get(analysis.documentId);
      if (!document) throw new Error('Document not found.');

      let fileBase64: string | undefined;
      if (document.fileType === 'image' || document.fileType === 'pdf') {
        const uri = resolveUri(document.fileUri);
        fileBase64 = await new File(uri).base64();
      }

      const result = await runDocumentAnalysis({
        documentId: document.id,
        caseId: document.caseId,
        fileName: document.fileName,
        fileBase64,
        mimeType: document.mimeType,
        isOnline,
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
        <View style={styles.content}>
          <EmptyState title="Couldn't complete analysis" message={error} />
          <Button label="Retry" onPress={runInitialAnalysis} />
        </View>
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{GUIDANCE_DISCLAIMER}</Text>
        </View>
        <Text style={styles.providerTag}>
          {analysis.provider === 'gemini' ? 'Analyzed with Gemini (online)' : 'Analyzed with offline model'}
        </Text>

        {analysis.issueSummary ? (
          <Section title="Issue summary">
            <Text style={styles.bodyText}>{analysis.issueSummary}</Text>
          </Section>
        ) : null}

        {analysis.status === 'needs_clarification' && analysis.clarifyingQuestions?.length ? (
          <Section title="A few questions before I can recommend next steps">
            {analysis.clarifyingQuestions.map((question) => (
              <View key={question} style={styles.questionBlock}>
                <Text style={styles.questionText}>{question}</Text>
                <TextInput
                  style={styles.answerInput}
                  placeholder="Your answer"
                  placeholderTextColor={colors.textMuted}
                  value={answers[question] ?? ''}
                  onChangeText={(text) => setAnswers((prev) => ({ ...prev, [question]: text }))}
                  multiline
                />
              </View>
            ))}
            <Button label="Submit Answers" onPress={onSubmitAnswers} loading={submitting} />
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
              <Text key={index} style={styles.stepText}>
                {index + 1}. {step}
              </Text>
            ))}
          </Section>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function RecommendationSection({ title, items }: { title: string; items: RecommendationItem[] }) {
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <View key={index} style={styles.recommendationRow}>
          <Text style={styles.recommendationName}>{item.name}</Text>
          <Text style={styles.recommendationReason}>{item.reason}</Text>
        </View>
      ))}
    </Section>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 4,
  },
  disclaimer: {
    backgroundColor: '#FFF4E5',
    borderColor: colors.warning,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  disclaimerText: {
    color: colors.warning,
    fontSize: 12,
  },
  providerTag: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  questionBlock: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  recommendationRow: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  recommendationName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  recommendationReason: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  stepText: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 18,
  },
});
