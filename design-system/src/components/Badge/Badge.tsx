import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type BadgeVariant = 'accent' | 'solid' | 'warn' | 'note' | 'ok';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'accent', className, ...rest }: BadgeProps) {
  return <span className={cn('pui-badge', `pui-badge--${variant}`, className)} {...rest} />;
}
