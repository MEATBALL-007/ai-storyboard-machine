import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export const BADGE_VARIANTS = [
  'accent', 'solid', 'warn', 'note', 'ok', 'neutral', 'accent-solid',
] as const;

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'accent', className, ...rest }: BadgeProps) {
  return <span className={cn('pui-badge', `pui-badge--${variant}`, className)} {...rest} />;
}
