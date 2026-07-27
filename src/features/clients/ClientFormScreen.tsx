import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { clientRepository } from '@/db/repositories/clientRepository';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientForm'>;

interface ClientFormValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

const defaultValues: ClientFormValues = { name: '', phone: '', email: '', address: '', notes: '' };

export function ClientFormScreen({ route, navigation }: Props) {
  const { clientId } = route.params;
  const [loading, setLoading] = useState(!!clientId);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({ defaultValues });

  useEffect(() => {
    if (!clientId) return;
    clientRepository.get(clientId).then((client) => {
      if (client) {
        reset({
          name: client.name,
          phone: client.phone ?? '',
          email: client.email ?? '',
          address: client.address ?? '',
          notes: client.notes ?? '',
        });
      }
      setLoading(false);
    });
  }, [clientId, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim() || null,
      email: values.email.trim() || null,
      address: values.address.trim() || null,
      notes: values.notes.trim() || null,
    };
    if (clientId) {
      await clientRepository.update(clientId, payload);
    } else {
      await clientRepository.create(payload);
    }
    navigation.goBack();
  });

  const onDelete = () => {
    if (!clientId) return;
    Alert.alert('Delete client', 'This cannot be undone. Cases referencing this client will keep the reference but should be updated manually.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await clientRepository.remove(clientId);
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
              placeholder="e.g. Ramesh Kumar"
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TextField
              label="Phone"
              value={field.value}
              onChangeText={field.onChange}
              keyboardType="phone-pad"
              placeholder="+91…"
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              label="Email"
              value={field.value}
              onChangeText={field.onChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
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
        <Button label={clientId ? 'Save Changes' : 'Add Client'} onPress={onSubmit} loading={isSubmitting} />
        {clientId ? (
          <Button label="Delete Client" onPress={onDelete} variant="danger" />
        ) : null}
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
