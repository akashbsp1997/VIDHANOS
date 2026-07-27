import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router';

import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';
import { casesRepo } from '@/db/repositories/casesRepo';
import { clientsRepo } from '@/db/repositories/clientsRepo';
import { opponentsRepo } from '@/db/repositories/opponentsRepo';
import type { Client, Opponent } from '@/db/schema';

interface CaseFormValues {
  title: string;
  clientId: string;
  caseType: string;
  cnrNumber: string;
  filingNumber: string;
  filingDate: number | undefined;
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
  caseType: '',
  cnrNumber: '',
  filingNumber: '',
  filingDate: undefined,
  registrationNumber: '',
  forumName: '',
  courtState: '',
  courtDistrict: '',
  courtComplex: '',
  judgeName: '',
  stage: '',
  notes: '',
};

export function CaseFormScreen() {
  const { caseId } = useParams<{ caseId: string }>();
  if (!caseId) throw new Error('CaseFormScreen requires a caseId (edit-only; new cases are created via /new-matter).');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [opponentIds, setOpponentIds] = useState<string[]>([]);
  const [opponentPickerOpen, setOpponentPickerOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CaseFormValues>({ defaultValues });

  useEffect(() => {
    Promise.all([clientsRepo.list(), opponentsRepo.list(), casesRepo.get(caseId)]).then(
      ([clientList, opponentList, caseData]) => {
        setClients(clientList);
        setOpponents(opponentList);
        if (caseData) {
          reset({
            title: caseData.title,
            clientId: caseData.clientId,
            caseType: caseData.caseType ?? '',
            cnrNumber: caseData.cnrNumber ?? '',
            filingNumber: caseData.filingNumber ?? '',
            filingDate: caseData.filingDate,
            registrationNumber: caseData.registrationNumber ?? '',
            forumName: caseData.forumName ?? '',
            courtState: caseData.courtState ?? '',
            courtDistrict: caseData.courtDistrict ?? '',
            courtComplex: caseData.courtComplex ?? '',
            judgeName: caseData.judgeName ?? '',
            stage: caseData.stage ?? '',
            notes: caseData.notes ?? '',
          });
          setOpponentIds(caseData.opponents.map((o) => o.id));
        }
        setLoading(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      title: values.title.trim(),
      clientId: values.clientId,
      caseType: values.caseType.trim() || undefined,
      cnrNumber: values.cnrNumber.trim() || undefined,
      filingNumber: values.filingNumber.trim() || undefined,
      filingDate: values.filingDate,
      registrationNumber: values.registrationNumber.trim() || undefined,
      forumName: values.forumName.trim() || undefined,
      courtState: values.courtState.trim() || undefined,
      courtDistrict: values.courtDistrict.trim() || undefined,
      courtComplex: values.courtComplex.trim() || undefined,
      judgeName: values.judgeName.trim() || undefined,
      stage: values.stage.trim() || undefined,
      notes: values.notes.trim() || undefined,
      caseStatus: 'pending',
      priority: 'normal',
    };

    await casesRepo.update(caseId, payload);
    await casesRepo.setOpponents(caseId, opponentIds);
    navigate(`/cases/${caseId}`);
  });

  if (loading) return <Screen>{null}</Screen>;

  const selectedOpponentNames = opponents.filter((o) => opponentIds.includes(o.id)).map((o) => o.name);

  return (
    <Screen>
      <form className="screen-header" onSubmit={onSubmit}>
        <Controller
          control={control}
          name="title"
          rules={{ required: 'Case title is required' }}
          render={({ field }) => (
            <TextField label="Case title" placeholder="e.g. Ramesh Kumar vs Suresh Traders" error={errors.title?.message} {...field} />
          )}
        />
        <Controller
          control={control}
          name="clientId"
          rules={{ required: 'Select a client' }}
          render={({ field }) => (
            <SelectField
              label="Client (applicant)"
              placeholder={clients.length ? 'Select a client' : 'No clients yet — add one first'}
              options={clients.map((c) => ({ value: c.id, label: c.name }))}
              error={errors.clientId?.message}
              {...field}
            />
          )}
        />

        <div className="field">
          <span className="field-label">Opponents</span>
          <Button
            label={selectedOpponentNames.length ? selectedOpponentNames.join(', ') : 'Select opponents (optional)'}
            variant="secondary"
            onClick={() => setOpponentPickerOpen(true)}
          />
        </div>

        <Controller control={control} name="caseType" render={({ field }) => <TextField label="Case type" placeholder="e.g. Civil Suit" {...field} />} />
        <Controller control={control} name="forumName" render={({ field }) => <TextField label="Forum / Court" placeholder="e.g. District Consumer Commission" {...field} />} />
        <Controller control={control} name="courtState" render={({ field }) => <TextField label="State" {...field} />} />
        <Controller control={control} name="courtDistrict" render={({ field }) => <TextField label="District" {...field} />} />
        <Controller control={control} name="courtComplex" render={({ field }) => <TextField label="Court complex" {...field} />} />
        <Controller control={control} name="judgeName" render={({ field }) => <TextField label="Judge" {...field} />} />
        <Controller control={control} name="cnrNumber" render={({ field }) => <TextField label="CNR number" {...field} />} />
        <Controller control={control} name="filingNumber" render={({ field }) => <TextField label="Filing number" {...field} />} />
        <Controller
          control={control}
          name="filingDate"
          render={({ field }) => <DateField label="Filing date" value={field.value} onChange={field.onChange} />}
        />
        <Controller control={control} name="registrationNumber" render={({ field }) => <TextField label="Registration number" {...field} />} />
        <Controller control={control} name="stage" render={({ field }) => <TextField label="Stage" placeholder="e.g. Evidence, Arguments" {...field} />} />
        <Controller control={control} name="notes" render={({ field }) => <TextField label="Notes" multiline {...field} />} />

        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: -6, marginBottom: 14 }}>
          Looking up the case?{' '}
          <a href="https://services.ecourts.gov.in/ecourtindia_v6/" target="_blank" rel="noopener noreferrer">
            Open eCourts ↗
          </a>{' '}
          in a new tab, then type the details in here.
        </p>

        <Button label="Save Changes" type="submit" loading={isSubmitting} />
      </form>

      <Modal open={opponentPickerOpen} title="Select opponents" onClose={() => setOpponentPickerOpen(false)} closeLabel="Done">
        {opponents.length === 0 ? (
          <div style={{ padding: 16 }}>
            <p className="empty-state-message">
              No opponents yet. <Link to="/opponents/new">Add one</Link> first.
            </p>
          </div>
        ) : (
          opponents.map((opponent) => (
            <label key={opponent.id} className="checkbox-row">
              <input
                type="checkbox"
                checked={opponentIds.includes(opponent.id)}
                onChange={() =>
                  setOpponentIds((prev) =>
                    prev.includes(opponent.id) ? prev.filter((id) => id !== opponent.id) : [...prev, opponent.id]
                  )
                }
              />
              {opponent.name}
            </label>
          ))
        )}
      </Modal>
    </Screen>
  );
}
