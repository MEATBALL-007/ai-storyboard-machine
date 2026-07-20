import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  items: MenuItem[];
  header?: string;
}

export function Menu({ items, header, className, ...rest }: MenuProps) {
  return (
    <div className={cn('pui-menu', className)} role="menu" {...rest}>
      {header && <div className="pui-menu__header">{header}</div>}
      {items.map((it, i) => (
        <button
          key={i}
          className={cn('pui-menu__item', it.danger && 'pui-menu__item--danger')}
          disabled={it.disabled}
          onClick={it.onClick}
          role="menuitem"
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
