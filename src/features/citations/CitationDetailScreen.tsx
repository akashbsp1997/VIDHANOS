import { File } from 'expo-file-system';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { citationRepository } from '@/db/repositories/citationRepository';
import { generateId } from '@/db/id';
import type { RootStackScreenProps } from '@/navigation/types';
import { saveDownloadedCitation } from '@/services/fileStorage';
import { docSnippet, getDoc, getOrigDocDownload, type IndianKanoonDoc } from '@/services/indianKanoonApi';
import { colors } from '@/theme/colors';

type Props = RootStackScreenProps<'CitationDetail'>;

export function CitationDetailScreen({ route, navigation }: Props) {
  const { tid, caseId } = route.params;
  const [doc, setDoc] = useState<IndianKanoonDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(Number(tid))
      .then(setDoc)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load judgment.'))
      .finally(() => setLoading(false));
  }, [tid]);

  const onSave = async () => {
    if (!doc) return;
    setSaving(true);
    setError(null);
    try {
      const citationId = generateId();
      let localFileUri: string | null = null;

      try {
        const { url, headers } = await getOrigDocDownload(Number(tid));
        const downloaded = new File(url);
        const task = File.createDownloadTask(url, downloaded, { headers });
        const file = await task.downloadAsync();
        if (file) {
          localFileUri = await saveDownloadedCitation(file.uri, citationId);
        }
      } catch {
        // Original scanned copy isn't always available — the citation is still useful without it.
      }

      await citationRepository.create({
        id: citationId,
        caseId: caseId ?? null,
        indianKanoonDocId: String(doc.tid),
        title: doc.title,
        court: doc.docsource ?? null,
        citationText: null,
        dateOfJudgment: doc.publishdate ? Date.parse(doc.publishdate) || null : null,
        snippet: docSnippet(doc.doc, 400),
        sourceUrl: `https://indiankanoon.org/doc/${doc.tid}/`,
        localFileUri,
      });

      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save citation.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Screen><></></Screen>;

  if (error && !doc) {
    return (
      <Screen>
        <EmptyState title="Couldn't load judgment" message={error} />
      </Screen>
    );
  }

  if (!doc) return <Screen><></></Screen>;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{doc.title}</Text>
        <Text style={styles.meta}>
          {[doc.docsource, doc.publishdate].filter(Boolean).join(' · ')}
        </Text>
        <Text style={styles.snippet}>{docSnippet(doc.doc, 2000)}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <Button label="Save to Case" onPress={onSave} loading={saving} disabled={!caseId} />
          {!caseId ? <Text style={styles.hint}>Open this search from inside a case to save citations to it.</Text> : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 12,
  },
  snippet: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 12,
  },
  actions: {
    marginTop: 20,
    gap: 8,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
