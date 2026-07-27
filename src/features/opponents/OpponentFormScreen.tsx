import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { opponentRepository } from '@/db/repositories/opponentRepository';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OpponentForm'>;

interface OpponentFormValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

const defaultValues: OpponentFormValues = { name: '', phone: '', email: '', address: '', notes: '' };

export function OpponentFormScreen({ route, navigation }: Props) {
  const { opponentId } = route.params;
  const [loading, setLoading] = useState(!!opponentId);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OpponentFormValues>({ defaultValues });

  useEffect(() => {
    if (!opponentId) return;
    opponentRepository.get(opponentId).then((opponent) => {
      if (opponent) {
        reset({
          name: opponent.name,
          phone: opponent.phone ?? '',
          email: opponent.email ?? '',
          address: opponent.address ?? '',
          notes: opponent.notes ?? '',
        });
      }
      setLoading(false);
    });
  }, [opponentId, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim() || null,
      email: values.email.trim() || null,
      address: values.address.trim() || null,
      notes: values.notes.trim() || null,
    };
    if (opponentId) {
      await opponentRepository.update(opponentId, payload);
    } else {
      await opponentRepository.create(payload);
    }
    navigation.goBack();
  });

  const onDelete = () => {
    if (!opponentId) return;
    Alert.alert('Delete opponent', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await opponentRepository.remove(opponentId);
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
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <TextField
              label="Full name"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.name?.message}
              placeholder="e.g. Suresh Traders Pvt Ltd"
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TextField label="Phone" value={field.value} onChangeText={field.onChange} keyboardType="phone-pad" />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField label="Email" value={field.value} onChangeText={field.onChange} keyboardType="email-address" autoCapitalize="none" />
          )}
        />
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <TextField label="Address" value={field.value} onChangeText={field.onChange} multiline />
          )}
        />
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <TextField label="Notes" value={field.value} onChangeText={field.onChange} multiline />
          )}
        />
        <Button label={opponentId ? 'Save Changes' : 'Add Opponent'} onPress={onSubmit} loading={isSubmitting} />
        {opponentId ? <Button label="Delete Opponent" onPress={onDelete} variant="danger" /> : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 4,
  },
});
