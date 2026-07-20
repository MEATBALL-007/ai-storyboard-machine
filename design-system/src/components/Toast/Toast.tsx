import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  message: string;
  variant?: 'default' | 'error';
  action?: ToastAction;
}

export function Toast({ open, message, variant = 'default', action, className, ...rest }: ToastProps) {
  return (
    <div
      className={cn('pui-toast', variant === 'error' && 'pui-toast--error', open && 'is-open', className)}
      role="status"
      {...rest}
    >
      {message}
      {action && (
        <span className="pui-toast__action" onClick={action.onClick}>
          {action.label}
        </span>
      )}
    </div>
  );
}
