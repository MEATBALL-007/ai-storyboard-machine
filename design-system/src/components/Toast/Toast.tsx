import { cn } from '../../lib/cn';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  open: boolean;
  message: string;
  variant?: 'default' | 'error';
  action?: ToastAction;
  className?: string;
}

export function Toast({ open, message, variant = 'default', action, className }: ToastProps) {
  return (
    <div
      className={cn('pui-toast', variant === 'error' && 'pui-toast--error', open && 'is-open', className)}
      role="status"
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
