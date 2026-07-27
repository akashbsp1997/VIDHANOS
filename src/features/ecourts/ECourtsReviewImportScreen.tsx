import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { caseRepository } from '@/db/repositories/caseRepository';
import { clientRepository } from '@/db/repositories/clientRepository';
import { hearingRepository } from '@/db/repositories/hearingRepository';
import { opponentRepository } from '@/db/repositories/opponentRepository';
import type { RootStackScreenProps } from '@/navigation/types';
import { scheduleHearingReminder } from '@/services/notifications';
import { colors } from '@/theme/colors';
import { parseEcourtsPayload, type EcourtsRawData } from './parseEcourtsPayload';

type Props = RootStackScreenProps<'ECourtsReviewImport'>;

interface ReviewFormValues {
  petitionerName: string;
  respondentName: string;
  cnrNumber: string;
  filingNumber: string;
  filingDate: number | null;
  registrationNumber: string;
  caseType: string;
  forumName: string;
  judgeName: string;
  caseStatus: string;
  stage: string;
  nextHearingDate: number | null;
}

export function ECourtsReviewImportScreen({ route, navigation }: Props) {
  const { caseId, raw } = useMemo(
    () => JSON.parse(route.params.payload) as { caseId?: string; raw: EcourtsRawData },
    [route.params.payload]
  );
  const parsed = useMemo(() => parseEcourtsPayload(raw), [raw]);
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit } = useForm<ReviewFormValues>({
    defaultValues: {
      petitionerName: parsed.petitionerName,
      respondentName: parsed.respondentName,
      cnrNumber: parsed.cnrNumber,
      filingNumber: parsed.filingNumber,
      filingDate: parsed.filingDate,
      registrationNumber: parsed.registrationNumber,
      caseType: parsed.caseType,
      forumName: parsed.forumName,
      judgeName: parsed.judgeName,
      caseStatus: parsed.caseStatus,
      stage: parsed.stage,
      nextHearingDate: parsed.nextHearingDate,
    },
  });

  const onConfirm = handleSubmit(async (values) => {
    setSaving(true);

    const casePayload = {
      cnrNumber: values.cnrNumber || null,
      filingNumber: values.filingNumber || null,
      filingDate: values.filingDate,
      registrationNumber: values.registrationNumber || null,
      caseType: values.caseType || null,
      forumName: values.forumName || null,
      judgeName: values.judgeName || null,
      caseStatus: values.caseStatus || 'pending',
      stage: values.stage || null,
      source: 'ecourts_import' as const,
    };

    let targetCaseId = caseId;

    if (targetCaseId) {
      await caseRepository.update(targetCaseId, casePayload);
    } else {
      const client = await clientRepository.create({ name: values.petitionerName || 'Unknown applicant' });
      const created = await caseRepository.create({
        title: `${values.petitionerName || 'Applicant'} vs ${values.respondentName || 'Opponent'}`,
        clientId: client.id,
        ...casePayload,
      });
      targetCaseId = created.id;

      if (values.respondentName) {
        const opponent = await opponentRepository.create({ name: values.respondentName });
        await caseRepository.setOpponents(targetCaseId, [opponent.id]);
      }
    }

    const existingHearings = await hearingRepository.listByCase(targetCaseId);
    const existingDates = new Set(existingHearings.map((h) => h.hearingDate));

    for (const hearing of parsed.hearings) {
      if (existingDates.has(hearing.date)) continue;
      const created = await hearingRepository.create({
        caseId: targetCaseId,
        hearingDate: hearing.date,
        orderSummary: hearing.purpose || null,
        orderType: 'hearing',
        source: 'ecourts_import',
      });
      if (created.hearingDate > Date.now()) {
        await scheduleHearingReminder(created);
      }
    }

    setSaving(false);
    navigation.navigate('CaseDetail', { caseId: targetCaseId });
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Review and edit before saving. {parsed.hearings.length} hearing/order entr
            {parsed.hearings.length === 1 ? 'y' : 'ies'} found on the page.
          </Text>
        </View>

        <Controller control={control} name="petitionerName" render={({ field }) => (
          <TextField label="Petitioner / Applicant" value={field.value} onChangeText={field.onChange} editable={!caseId} />
        )} />
        <Controller control={control} name="respondentName" render={({ field }) => (
          <TextField label="Respondent / Opponent" value={field.value} onChangeText={field.onChange} editable={!caseId} />
        )} />
        <Controller control={control} name="caseType" render={({ field }) => (
          <TextField label="Case type" value={field.value} onChangeText={field.onChange} />
        )} />
        <Controller control={control} name="forumName" render={({ field }) => (
          <TextField label="Forum / Court" value={field.value} onChangeText={field.onChange} />
        )} />
        <Controller control={control} name="judgeName" render={({ field }) => (
          <TextField label="Judge" value={field.value} onChangeText={field.onChange} />
        )} />
        <Controller control={control} name="cnrNumber" render={({ field }) => (
          <TextField label="CNR number" value={field.value} onChangeText={field.onChange} autoCapitalize="characters" />
        )} />
        <Controller control={control} name="filingNumber" render={({ field }) => (
          <TextField label="Filing number" value={field.value} onChangeText={field.onChange} />
        )} />
        <Controller control={control} name="filingDate" render={({ field }) => (
          <DateField label="Filing date" value={field.value} onChange={field.onChange} />
        )} />
        <Controller control={control} name="registrationNumber" render={({ field }) => (
          <TextField label="Registration number" value={field.value} onChangeText={field.onChange} />
        )} />
        <Controller control={control} name="caseStatus" render={({ field }) => (
          <TextField label="Case status" value={field.value} onChangeText={field.onChange} />
        )} />
        <Controller control={control} name="stage" render={({ field }) => (
          <TextField label="Stage" value={field.value} onChangeText={field.onChange} />
        )} />
        <Controller control={control} name="nextHearingDate" render={({ field }) => (
          <DateField label="Next hearing date" value={field.value} onChange={field.onChange} />
        )} />

        <Button
          label={caseId ? 'Save to Case' : 'Create Case'}
          onPress={onConfirm}
          loading={saving}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 4,
  },
  banner: {
    backgroundColor: '#EAF0FB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  bannerText: {
    fontSize: 12,
    color: colors.primary,
  },
});
