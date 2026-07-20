import { cn } from '../../lib/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, className, id }: ToggleProps) {
  return (
    <label className={cn('pui-toggle', className)}>
      <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
