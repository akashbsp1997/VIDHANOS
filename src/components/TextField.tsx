import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: string;
  multiline?: false;
}

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string;
  error?: string;
  multiline: true;
}

export function TextField(props: TextFieldProps | TextAreaFieldProps) {
  const { label, error } = props;
  const id = useId();
  const { label: _label, error: _error, multiline: _multiline, ...rest } = props;

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {props.multiline ? (
        <textarea id={id} className="field-textarea" {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input id={id} className="field-input" {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
