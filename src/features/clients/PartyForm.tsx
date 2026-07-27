import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';

export interface PartyFormValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

interface Party {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

interface PartyFormProps {
  entityLabel: string;
  namePlaceholder: string;
  partyId?: string;
  loadParty: (id: string) => Promise<Party | undefined>;
  onCreate: (values: PartyFormValues) => Promise<void>;
  onUpdate: (id: string, values: PartyFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  backTo: string;
}

const defaultValues: PartyFormValues = { name: '', phone: '', email: '', address: '', notes: '' };

export function PartyForm({
  entityLabel,
  namePlaceholder,
  partyId,
  loadParty,
  onCreate,
  onUpdate,
  onDelete,
  backTo,
}: PartyFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!partyId);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartyFormValues>({ defaultValues });

  useEffect(() => {
    if (!partyId) return;
    loadParty(partyId).then((party) => {
      if (party) {
        reset({
          name: party.name,
          phone: party.phone ?? '',
          email: party.email ?? '',
          address: party.address ?? '',
          notes: party.notes ?? '',
        });
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyId]);

  const onSubmit = handleSubmit(async (values) => {
    if (partyId) {
      await onUpdate(partyId, values);
    } else {
      await onCreate(values);
    }
    navigate(backTo);
  });

  const handleDelete = async () => {
    if (!partyId) return;
    if (!confirm(`Delete this ${entityLabel.toLowerCase()}? This cannot be undone.`)) return;
    await onDelete(partyId);
    navigate(backTo);
  };

  if (loading) return <Screen>{null}</Screen>;

  return (
    <Screen>
      <form className="screen-header" onSubmit={onSubmit}>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <TextField label="Full name" placeholder={namePlaceholder} error={errors.name?.message} {...field} />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => <TextField label="Phone" type="tel" {...field} />}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => <TextField label="Email" type="email" {...field} />}
        />
        <Controller
          control={control}
          name="address"
          render={({ field }) => <TextField label="Address" multiline {...field} />}
        />
        <Controller
          control={control}
          name="notes"
          render={({ field }) => <TextField label="Notes" multiline {...field} />}
        />
        <div className="btn-row" style={{ flexDirection: 'column' }}>
          <Button label={partyId ? 'Save Changes' : `Add ${entityLabel}`} type="submit" loading={isSubmitting} />
          {partyId ? <Button label={`Delete ${entityLabel}`} variant="danger" onClick={handleDelete} /> : null}
        </div>
      </form>
    </Screen>
  );
}
