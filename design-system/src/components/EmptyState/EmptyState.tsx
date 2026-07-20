import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description, className, ...rest }: EmptyStateProps) {
  return (
    <div className={cn('pui-empty', className)} {...rest}>
      {icon && <div className="pui-empty__icon">{icon}</div>}
      <h2 className="pui-empty__title">{title}</h2>
      {description && <p className="pui-empty__desc">{description}</p>}
    </div>
  );
}
