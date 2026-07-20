import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, ...rest }: TextareaProps) {
  return (
    <label className="pui-field">
      {label && <span className="pui-field__label">{label}</span>}
      <textarea className={cn('pui-textarea', className)} {...rest} />
    </label>
  );
}
