import { cn } from '../../lib/cn';

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedToggleProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedToggle({ options, value, onChange, className }: SegmentedToggleProps) {
  return (
    <div className={cn('pui-segmented', className)} role="group">
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
