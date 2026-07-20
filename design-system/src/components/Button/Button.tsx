import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'ghost' | 'icon' | 'tab';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  active?: boolean;
}

export function Button({ variant = 'primary', active, className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn('pui-btn', `pui-btn--${variant}`, active && 'is-active', className)}
      {...rest}
    />
  );
}
