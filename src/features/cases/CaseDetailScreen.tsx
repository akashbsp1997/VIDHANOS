import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { caseRepository } from '@/db/repositories/caseRepository';
import { citationRepository } from '@/db/repositories/citationRepository';
import { documentRepository } from '@/db/repositories/documentRepository';
import { hearingRepository } from '@/db/repositories/hearingRepository';
import { useFocusRefresh } from '@/hooks/useFocusRefresh';
import type { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = RootStackScreenProps<'CaseDetail'>;

const TABS = ['Overview', 'Hearings', 'Documents', 'Citations'] as const;
type Tab = (typeof TABS)[number];

export function CaseDetailScreen({ route, navigation }: Props) {
  const { caseId } = route.params;
  const [tab, setTab] = useState<Tab>('Overview');

  const { data: caseData, reload: reloadCase } = useFocusRefresh(() => caseRepository.get(caseId), [caseId]);
  const { data: hearings, reload: reloadHearings } = useFocusRefresh(
    () => hearingRepository.listByCase(caseId),
    [caseId]
  );
  const { data: documents, reload: reloadDocuments } = useFocusRefresh(
    () => documentRepository.listByCase(caseId),
    [caseId]
  );
  const { data: citations } = useFocusRefresh(() => citationRepository.listByCase(caseId), [caseId]);

  useEffect(() => {
    if (caseData) navigation.setOptions({ title: caseData.title });
  }, [caseData, navigation]);

  if (!caseData) return <Screen><></></Screen>;

  const onDeleteHearing = (hearingId: string) => {
    Alert.alert('Delete hearing', 'This will also cancel its reminder.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await hearingRepository.remove(hearingId);
          reloadHearings();
          reloadCase();
        },
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'Overview' ? (
        <ScrollView contentContainerStyle={styles.overview}>
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
          <Row label="Source" value={caseData.source === 'ecourts_import' ? 'Imported from eCourts' : 'Manual entry'} />

          <View style={styles.actions}>
            <Button label="Edit Case" onPress={() => navigation.navigate('CaseForm', { caseId })} />
            <Button
              label="Import from eCourts"
              variant="secondary"
              onPress={() => navigation.navigate('ECourtsImport', { caseId })}
            />
          </View>
        </ScrollView>
      ) : null}

      {tab === 'Hearings' ? (
        <>
          <View style={styles.actionBar}>
            <Button label="Add Hearing" onPress={() => navigation.navigate('HearingForm', { caseId })} />
          </View>
          <FlatList
            data={hearings ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListRow
                title={item.orderSummary || item.purpose || (item.isDeadline ? 'Deadline' : 'Hearing')}
                subtitle={item.purpose && item.orderSummary ? item.purpose : item.orderType}
                meta={format(new Date(item.hearingDate), 'dd MMM yyyy')}
                onPress={() => navigation.navigate('HearingForm', { caseId, hearingId: item.id })}
              />
            )}
            ListEmptyComponent={<EmptyState title="No hearings/orders yet" message="Add the next hearing date or a filing deadline." />}
          />
        </>
      ) : null}

      {tab === 'Documents' ? (
        <>
          <View style={styles.actionBar}>
            <Button label="Upload Document" onPress={() => navigation.navigate('DocumentUpload', { caseId })} />
          </View>
          <FlatList
            data={documents ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListRow
                title={item.fileName}
                subtitle={item.fileType === 'pdf' ? `PDF · ${item.pageCount ?? '?'} pages` : 'Image'}
                meta={format(new Date(item.createdAt), 'dd MMM yyyy')}
                onPress={() => navigation.navigate('DocumentViewer', { documentId: item.id })}
              />
            )}
            ListEmptyComponent={<EmptyState title="No documents yet" message="Upload receipts, applications, orders, or bills for this case." />}
          />
        </>
      ) : null}

      {tab === 'Citations' ? (
        <>
          <View style={styles.actionBar}>
            <Button label="Search Citations" onPress={() => navigation.navigate('CitationSearch', { caseId })} />
          </View>
          <FlatList
            data={citations ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListRow
                title={item.title}
                subtitle={item.court ?? undefined}
                meta={item.dateOfJudgment ? format(new Date(item.dateOfJudgment), 'dd MMM yyyy') : undefined}
              />
            )}
            ListEmptyComponent={<EmptyState title="No citations saved" message="Search Indian Kanoon for relevant judgments to cite." />}
          />
        </>
      ) : null}
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.primary,
  },
  overview: {
    padding: 16,
  },
  row: {
    marginBottom: 12,
  },
  rowLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 15,
    color: colors.text,
    marginTop: 2,
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  actionBar: {
    padding: 16,
    paddingBottom: 0,
  },
});
