import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedToggleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedToggle({ options, value, onChange, className, ...rest }: SegmentedToggleProps) {
  return (
    <div className={cn('pui-segmented', className)} role="group" {...rest}>
      {options.map((o) => (
        <button
          key={o.value}
          className={cn('pui-segmented__btn', value === o.value && 'is-active')}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
