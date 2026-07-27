import { useId, type SelectHTMLAttributes } from 'react';

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function SelectField({ label, error, options, placeholder, ...rest }: SelectFieldProps) {
  const id = useId();

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="field-select" {...rest}>
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
