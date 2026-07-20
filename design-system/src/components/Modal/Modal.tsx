import type { ReactNode, MouseEvent } from 'react';
import { cn } from '../../lib/cn';

export interface ModalProps {
  open: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Modal({ open, title, subtitle, onClose, actions, children, className }: ModalProps) {
  const onBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose?.();
  };
  return (
    <div className={cn('pui-modal-bg', open && 'is-open')} onClick={onBackdrop}>
      <div className={cn('pui-modal', className)} role="dialog" aria-modal="true">
        {title && <h3 className="pui-modal__title">{title}</h3>}
        {subtitle && <p className="pui-modal__sub">{subtitle}</p>}
        {children}
        {actions && <div className="pui-modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
