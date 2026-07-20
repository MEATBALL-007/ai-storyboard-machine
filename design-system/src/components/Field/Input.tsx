import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({ label, hint, className, ...rest }: InputProps) {
  return (
    <label className="pui-field">
      {label && <span className="pui-field__label">{label}</span>}
      <input className={cn('pui-input', className)} {...rest} />
      {hint && <span className="pui-field__hint">{hint}</span>}
    </label>
  );
}
