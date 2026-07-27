import { useId } from 'react';

interface DateFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  includeTime?: boolean;
}

/** Stores/returns epoch milliseconds; renders as a native date or datetime-local input. */
export function DateField({ label, value, onChange, includeTime }: DateFieldProps) {
  const id = useId();
  const type = includeTime ? 'datetime-local' : 'date';

  const stringValue = value ? toInputValue(value, includeTime) : '';

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="field-input"
        value={stringValue}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw ? new Date(raw).getTime() : undefined);
        }}
      />
    </div>
  );
}

function toInputValue(epochMs: number, includeTime?: boolean): string {
  const date = new Date(epochMs);
  const pad = (n: number) => String(n).padStart(2, '0');
  const datePart = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (!includeTime) return datePart;
  return `${datePart}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
