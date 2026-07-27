import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { Screen } from '@/components/Screen';
import { SelectField } from '@/components/SelectField';
import { SelectModal } from '@/components/SelectModal';
import { TextField } from '@/components/TextField';
import { caseRepository } from '@/db/repositories/caseRepository';
import { clientRepository } from '@/db/repositories/clientRepository';
import { opponentRepository } from '@/db/repositories/opponentRepository';
import type { RootStackParamList } from '@/navigation/types';
import type { Client, Opponent } from '@/types/db';

type Props = NativeStackScreenProps<RootStackParamList, 'CaseForm'>;

interface CaseFormValues {
  title: string;
  clientId: string;
  opponentIds: string[];
  caseType: string;
  cnrNumber: string;
  filingNumber: string;
  filingDate: number | null;
  registrationNumber: string;
  forumName: string;
  courtState: string;
  courtDistrict: string;
  courtComplex: string;
  judgeName: string;
  stage: string;
  notes: string;
}

const defaultValues: CaseFormValues = {
  title: '',
  clientId: '',
  opponentIds: [],
  caseType: '',
  cnrNumber: '',
  filingNumber: '',
  filingDate: null,
  registrationNumber: '',
  forumName: '',
  courtState: '',
  courtDistrict: '',
  courtComplex: '',
  judgeName: '',
  stage: '',
  notes: '',
};

export function CaseFormScreen({ route, navigation }: Props) {
  const { caseId } = route.params;
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [opponentPickerOpen, setOpponentPickerOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CaseFormValues>({ defaultValues });

  useEffect(() => {
    Promise.all([
      clientRepository.list(),
      opponentRepository.list(),
      caseId ? caseRepository.get(caseId) : Promise.resolve(undefined),
    ]).then(([clientList, opponentList, caseData]) => {
      setClients(clientList);
      setOpponents(opponentList);
      if (caseData) {
        reset({
          title: caseData.title,
          clientId: caseData.clientId,
          opponentIds: caseData.opponents.map((o) => o.id),
          caseType: caseData.caseType ?? '',
          cnrNumber: caseData.cnrNumber ?? '',
          filingNumber: caseData.filingNumber ?? '',
          filingDate: caseData.filingDate ?? null,
          registrationNumber: caseData.registrationNumber ?? '',
          forumName: caseData.forumName ?? '',
          courtState: caseData.courtState ?? '',
          courtDistrict: caseData.courtDistrict ?? '',
          courtComplex: caseData.courtComplex ?? '',
          judgeName: caseData.judgeName ?? '',
          stage: caseData.stage ?? '',
          notes: caseData.notes ?? '',
        });
      }
      setLoading(false);
    });
  }, [caseId, reset]);

  const clientId = watch('clientId');
  const opponentIds = watch('opponentIds');

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      title: values.title.trim(),
      clientId: values.clientId,
      caseType: values.caseType.trim() || null,
      cnrNumber: values.cnrNumber.trim() || null,
      filingNumber: values.filingNumber.trim() || null,
      filingDate: values.filingDate,
      registrationNumber: values.registrationNumber.trim() || null,
      forumName: values.forumName.trim() || null,
      courtState: values.courtState.trim() || null,
      courtDistrict: values.courtDistrict.trim() || null,
      courtComplex: values.courtComplex.trim() || null,
      judgeName: values.judgeName.trim() || null,
      stage: values.stage.trim() || null,
      notes: values.notes.trim() || null,
    };

    if (caseId) {
      await caseRepository.update(caseId, payload);
      await caseRepository.setOpponents(caseId, values.opponentIds);
      navigation.goBack();
    } else {
      const created = await caseRepository.create(payload, values.opponentIds);
      navigation.replace('CaseDetail', { caseId: created.id });
    }
  });

  const onDelete = () => {
    if (!caseId) return;
    Alert.alert('Delete case', 'This deletes the case record. Hearings, documents, and citations linked to it will remain but be orphaned — remove those separately if needed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await caseRepository.remove(caseId);
          navigation.popToTop();
        },
      },
    ]);
  };

  if (loading) return <Screen><></></Screen>;

  const selectedClient = clients.find((c) => c.id === clientId);
  const selectedOpponents = opponents.filter((o) => opponentIds.includes(o.id));

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="title"
          rules={{ required: 'Case title is required' }}
          render={({ field }) => (
            <TextField
              label="Case title"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.title?.message}
              placeholder="e.g. Ramesh Kumar vs Suresh Traders"
            />
          )}
        />
        <SelectField
          label="Client (applicant)"
          value={selectedClient?.name ?? ''}
          placeholder="Select a client"
          onPress={() => setClientPickerOpen(true)}
          error={errors.clientId?.message}
        />
        <SelectField
          label="Opponents"
          value={selectedOpponents.map((o) => o.name).join(', ')}
          placeholder="Select opponents (optional)"
          onPress={() => setOpponentPickerOpen(true)}
        />
        <Controller
          control={control}
          name="caseType"
          render={({ field }) => (
            <TextField label="Case type" value={field.value} onChangeText={field.onChange} placeholder="e.g. Civil Suit" />
          )}
        />
        <Controller
          control={control}
          name="forumName"
          render={({ field }) => (
            <TextField label="Forum / Court" value={field.value} onChangeText={field.onChange} placeholder="e.g. District Consumer Commission" />
          )}
        />
        <Controller
          control={control}
          name="courtState"
          render={({ field }) => <TextField label="State" value={field.value} onChangeText={field.onChange} />}
        />
        <Controller
          control={control}
          name="courtDistrict"
          render={({ field }) => <TextField label="District" value={field.value} onChangeText={field.onChange} />}
        />
        <Controller
          control={control}
          name="courtComplex"
          render={({ field }) => <TextField label="Court complex" value={field.value} onChangeText={field.onChange} />}
        />
        <Controller
          control={control}
          name="judgeName"
          render={({ field }) => <TextField label="Judge" value={field.value} onChangeText={field.onChange} />}
        />
        <Controller
          control={control}
          name="cnrNumber"
          render={({ field }) => (
            <TextField label="CNR number" value={field.value} onChangeText={field.onChange} autoCapitalize="characters" />
          )}
        />
        <Controller
          control={control}
          name="filingNumber"
          render={({ field }) => <TextField label="Filing number" value={field.value} onChangeText={field.onChange} />}
        />
        <Controller
          control={control}
          name="filingDate"
          render={({ field }) => <DateField label="Filing date" value={field.value} onChange={field.onChange} />}
        />
        <Controller
          control={control}
          name="registrationNumber"
          render={({ field }) => <TextField label="Registration number" value={field.value} onChangeText={field.onChange} />}
        />
        <Controller
          control={control}
          name="stage"
          render={({ field }) => <TextField label="Stage" value={field.value} onChangeText={field.onChange} placeholder="e.g. Evidence, Arguments" />}
        />
        <Controller
          control={control}
          name="notes"
          render={({ field }) => <TextField label="Notes" value={field.value} onChangeText={field.onChange} multiline />}
        />

        <Button
          label={caseId ? 'Save Changes' : 'Create Case'}
          onPress={onSubmit}
          loading={isSubmitting}
          disabled={!clientId}
        />
        {caseId ? <Button label="Delete Case" onPress={onDelete} variant="danger" /> : null}
      </ScrollView>

      <SelectModal
        visible={clientPickerOpen}
        title="Select client"
        options={clients.map((c) => ({ id: c.id, label: c.name, sublabel: c.phone ?? undefined }))}
        selectedIds={clientId ? [clientId] : []}
        onToggle={(id) => setValue('clientId', id, { shouldValidate: true })}
        onClose={() => setClientPickerOpen(false)}
        emptyMessage="Add a client first from the Clients list."
      />
      <SelectModal
        visible={opponentPickerOpen}
        title="Select opponents"
        multi
        options={opponents.map((o) => ({ id: o.id, label: o.name, sublabel: o.phone ?? undefined }))}
        selectedIds={opponentIds}
        onToggle={(id) => {
          const next = opponentIds.includes(id)
            ? opponentIds.filter((existing) => existing !== id)
            : [...opponentIds, id];
          setValue('opponentIds', next);
        }}
        onClose={() => setOpponentPickerOpen(false)}
        emptyMessage="Add an opponent first from the Opponents list."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 4,
  },
});
