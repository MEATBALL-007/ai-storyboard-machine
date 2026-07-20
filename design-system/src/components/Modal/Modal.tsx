import type { HTMLAttributes, ReactNode, MouseEvent } from 'react';
import { useEffect, useId } from 'react';
import { cn } from '../../lib/cn';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
}

export function Modal({ open, title, subtitle, onClose, actions, children, className, ...rest }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const onBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose?.();
  };
  return (
    <div className={cn('pui-modal-bg', open && 'is-open')} onClick={onBackdrop}>
      <div
        className={cn('pui-modal', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        {...rest}
      >
        {title && <h3 id={titleId} className="pui-modal__title">{title}</h3>}
        {subtitle && <p className="pui-modal__sub">{subtitle}</p>}
        {children}
        {actions && <div className="pui-modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
