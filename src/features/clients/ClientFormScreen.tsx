import { useParams } from 'react-router';

import { clientsRepo } from '@/db/repositories/clientsRepo';
import { PartyForm, type PartyFormValues } from './PartyForm';

export function ClientFormScreen() {
  const { clientId } = useParams<{ clientId: string }>();

  return (
    <PartyForm
      entityLabel="Client"
      namePlaceholder="e.g. Ramesh Kumar"
      partyId={clientId}
      loadParty={(id) => clientsRepo.get(id)}
      onCreate={(values: PartyFormValues) => clientsRepo.create(toPayload(values)).then(() => undefined)}
      onUpdate={(id, values) => clientsRepo.update(id, toPayload(values))}
      onDelete={(id) => clientsRepo.remove(id)}
      backTo="/clients"
    />
  );
}

function toPayload(values: PartyFormValues) {
  return {
    name: values.name.trim(),
    phone: values.phone.trim() || undefined,
    email: values.email.trim() || undefined,
    address: values.address.trim() || undefined,
    notes: values.notes.trim() || undefined,
  };
}
