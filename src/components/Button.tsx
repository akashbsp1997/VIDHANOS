import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export function Button({ label, variant = 'primary', loading, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled || loading}
      type={rest.type ?? 'button'}
      {...rest}
    >
      {loading ? 'Please wait…' : label}
    </button>
  );
}
