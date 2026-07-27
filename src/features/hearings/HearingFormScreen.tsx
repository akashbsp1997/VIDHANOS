import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { hearingRepository } from '@/db/repositories/hearingRepository';
import type { RootStackScreenProps } from '@/navigation/types';
import { cancelHearingReminder, scheduleHearingReminder } from '@/services/notifications';
import { colors } from '@/theme/colors';

type Props = RootStackScreenProps<'HearingForm'>;

interface HearingFormValues {
  hearingDate: number | null;
  purpose: string;
  judgeName: string;
  orderSummary: string;
  orderType: 'hearing' | 'order' | 'judgment';
  isDeadline: boolean;
  reminderOffsetMinutes: number;
}

const defaultValues: HearingFormValues = {
  hearingDate: null,
  purpose: '',
  judgeName: '',
  orderSummary: '',
  orderType: 'hearing',
  isDeadline: false,
  reminderOffsetMinutes: 1440,
};

const REMINDER_OPTIONS = [
  { label: '1 hour before', minutes: 60 },
  { label: '1 day before', minutes: 1440 },
  { label: '3 days before', minutes: 4320 },
  { label: '1 week before', minutes: 10080 },
];

export function HearingFormScreen({ route, navigation }: Props) {
  const { caseId, hearingId } = route.params;
  const [loading, setLoading] = useState(!!hearingId);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HearingFormValues>({ defaultValues });

  useEffect(() => {
    if (!hearingId) return;
    hearingRepository.get(hearingId).then((hearing) => {
      if (hearing) {
        reset({
          hearingDate: hearing.hearingDate,
          purpose: hearing.purpose ?? '',
          judgeName: hearing.judgeName ?? '',
          orderSummary: hearing.orderSummary ?? '',
          orderType: (hearing.orderType as HearingFormValues['orderType']) ?? 'hearing',
          isDeadline: !!hearing.isDeadline,
          reminderOffsetMinutes: hearing.reminderOffsetMinutes,
        });
      }
      setLoading(false);
    });
  }, [hearingId, reset]);

  const isDeadline = watch('isDeadline');
  const reminderOffsetMinutes = watch('reminderOffsetMinutes');

  const onSubmit = handleSubmit(async (values) => {
    if (!values.hearingDate) return;

    const payload = {
      caseId,
      hearingDate: values.hearingDate,
      purpose: values.purpose.trim() || null,
      judgeName: values.judgeName.trim() || null,
      orderSummary: values.orderSummary.trim() || null,
      orderType: values.orderType,
      isDeadline: values.isDeadline ? 1 : 0,
      reminderOffsetMinutes: values.reminderOffsetMinutes,
    };

    let savedId = hearingId;
    if (hearingId) {
      await hearingRepository.update(hearingId, payload);
    } else {
      const created = await hearingRepository.create(payload);
      savedId = created.id;
    }

    if (savedId) {
      const saved = await hearingRepository.get(savedId);
      if (saved) await scheduleHearingReminder(saved);
    }

    navigation.goBack();
  });

  const onDelete = () => {
    if (!hearingId) return;
    Alert.alert('Delete hearing', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const existing = await hearingRepository.get(hearingId);
          if (existing?.notificationId) await cancelHearingReminder(existing.notificationId);
          await hearingRepository.remove(hearingId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading) return <Screen><></></Screen>;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="hearingDate"
          rules={{ required: true }}
          render={({ field }) => (
            <DateField label={isDeadline ? 'Deadline date' : 'Hearing date'} value={field.value} onChange={field.onChange} mode="datetime" />
          )}
        />
        {errors.hearingDate ? <Text style={styles.error}>A date is required</Text> : null}

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>This is a filing deadline (not a hearing)</Text>
          <Controller
            control={control}
            name="isDeadline"
            render={({ field }) => <Switch value={field.value} onValueChange={field.onChange} />}
          />
        </View>

        <Controller
          control={control}
          name="purpose"
          render={({ field }) => (
            <TextField label="Purpose" value={field.value} onChangeText={field.onChange} placeholder="e.g. Arguments, Evidence, Filing of written statement" />
          )}
        />
        <Controller
          control={control}
          name="judgeName"
          render={({ field }) => <TextField label="Judge" value={field.value} onChangeText={field.onChange} />}
        />
        <Controller
          control={control}
          name="orderSummary"
          render={({ field }) => (
            <TextField label="Order / outcome summary" value={field.value} onChangeText={field.onChange} multiline placeholder="What happened / was ordered on this date" />
          )}
        />

        <Text style={styles.label}>Reminder</Text>
        <View style={styles.reminderOptions}>
          {REMINDER_OPTIONS.map((opt) => (
            <Button
              key={opt.minutes}
              label={opt.label}
              variant={reminderOffsetMinutes === opt.minutes ? 'primary' : 'secondary'}
              onPress={() => setValue('reminderOffsetMinutes', opt.minutes)}
            />
          ))}
        </View>

        <Button label={hearingId ? 'Save Changes' : 'Add Hearing'} onPress={onSubmit} loading={isSubmitting} />
        {hearingId ? <Button label="Delete" onPress={onDelete} variant="danger" /> : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  switchLabel: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
  },
  reminderOptions: {
    gap: 8,
    marginBottom: 16,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginBottom: 10,
    marginTop: -8,
  },
});
