import { useParams } from 'react-router';

import { opponentsRepo } from '@/db/repositories/opponentsRepo';
import { PartyForm, type PartyFormValues } from '@/features/clients/PartyForm';

export function OpponentFormScreen() {
  const { opponentId } = useParams<{ opponentId: string }>();

  return (
    <PartyForm
      entityLabel="Opponent"
      namePlaceholder="e.g. Suresh Traders Pvt Ltd"
      partyId={opponentId}
      loadParty={(id) => opponentsRepo.get(id)}
      onCreate={(values: PartyFormValues) => opponentsRepo.create(toPayload(values)).then(() => undefined)}
      onUpdate={(id, values) => opponentsRepo.update(id, toPayload(values))}
      onDelete={(id) => opponentsRepo.remove(id)}
      backTo="/opponents"
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
