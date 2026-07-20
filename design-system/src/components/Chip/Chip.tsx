import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
}

export function Chip({ selected, className, ...rest }: ChipProps) {
  return <div className={cn('pui-chip', selected && 'is-selected', className)} {...rest} />;
}
