import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { hearingsRepo } from '@/db/repositories/hearingsRepo';

interface HearingFormValues {
  hearingDate: number | undefined;
  purpose: string;
  judgeName: string;
  orderSummary: string;
  orderType: 'hearing' | 'order' | 'judgment';
  isDeadline: boolean;
  reminderOffsetMinutes: number;
}

const defaultValues: HearingFormValues = {
  hearingDate: undefined,
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

export function HearingFormScreen() {
  const { caseId, hearingId } = useParams<{ caseId: string; hearingId?: string }>();
  const navigate = useNavigate();
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
    hearingsRepo.get(hearingId).then((hearing) => {
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
    if (!values.hearingDate || !caseId) return;

    const payload = {
      caseId,
      hearingDate: values.hearingDate,
      purpose: values.purpose.trim() || undefined,
      judgeName: values.judgeName.trim() || undefined,
      orderSummary: values.orderSummary.trim() || undefined,
      orderType: values.orderType,
      isDeadline: (values.isDeadline ? 1 : 0) as 0 | 1,
      reminderOffsetMinutes: values.reminderOffsetMinutes,
    };

    if (hearingId) {
      await hearingsRepo.update(hearingId, payload);
    } else {
      await hearingsRepo.create(payload);
    }

    navigate(`/cases/${caseId}`);
  });

  const onDelete = async () => {
    if (!hearingId || !caseId) return;
    if (!confirm('Delete this hearing/order? This cannot be undone.')) return;
    await hearingsRepo.remove(hearingId);
    navigate(`/cases/${caseId}`);
  };

  if (loading) return <Screen>{null}</Screen>;

  return (
    <Screen>
      <form className="screen-header" onSubmit={onSubmit}>
        <Controller
          control={control}
          name="hearingDate"
          rules={{ required: true }}
          render={({ field }) => (
            <DateField label={isDeadline ? 'Deadline date' : 'Hearing date'} value={field.value} onChange={field.onChange} includeTime />
          )}
        />
        {errors.hearingDate ? <p className="field-error">A date is required</p> : null}

        <label className="checkbox-row" style={{ padding: '0 0 14px', border: 'none' }}>
          <input type="checkbox" checked={isDeadline} onChange={(e) => setValue('isDeadline', e.target.checked)} />
          This is a filing deadline (not a hearing)
        </label>

        <Controller
          control={control}
          name="purpose"
          render={({ field }) => (
            <TextField label="Purpose" placeholder="e.g. Arguments, Evidence, Filing of written statement" {...field} />
          )}
        />
        <Controller control={control} name="judgeName" render={({ field }) => <TextField label="Judge" {...field} />} />
        <Controller
          control={control}
          name="orderSummary"
          render={({ field }) => (
            <TextField label="Order / outcome summary" multiline placeholder="What happened / was ordered on this date" {...field} />
          )}
        />

        <div className="field">
          <span className="field-label">Reminder</span>
          <div className="btn-row" style={{ flexDirection: 'column' }}>
            {REMINDER_OPTIONS.map((opt) => (
              <Button
                key={opt.minutes}
                label={opt.label}
                variant={reminderOffsetMinutes === opt.minutes ? 'primary' : 'secondary'}
                onClick={() => setValue('reminderOffsetMinutes', opt.minutes)}
              />
            ))}
          </div>
        </div>

        <div className="btn-row" style={{ flexDirection: 'column' }}>
          <Button label={hearingId ? 'Save Changes' : 'Add Hearing'} type="submit" loading={isSubmitting} />
          {hearingId ? <Button label="Delete" variant="danger" onClick={onDelete} /> : null}
        </div>
      </form>
    </Screen>
  );
}
