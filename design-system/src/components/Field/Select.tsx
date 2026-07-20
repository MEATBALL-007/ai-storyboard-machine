import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
}

export function Select({ label, options, className, children, ...rest }: SelectProps) {
  return (
    <label className="pui-field">
      {label && <span className="pui-field__label">{label}</span>}
      <select className={cn('pui-select', className)} {...rest}>
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </select>
    </label>
  );
}
