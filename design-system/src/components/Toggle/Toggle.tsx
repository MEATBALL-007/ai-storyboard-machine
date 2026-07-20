import type { LabelHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface ToggleProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, className, id, ...rest }: ToggleProps) {
  return (
    <label className={cn('pui-toggle', className)} {...rest}>
      <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
