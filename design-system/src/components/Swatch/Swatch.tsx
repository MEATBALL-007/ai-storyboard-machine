import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SwatchProps extends HTMLAttributes<HTMLDivElement> {
  color: string;
  label?: string;
}

export function Swatch({ color, label, className, style, ...rest }: SwatchProps) {
  return (
    <div className={cn('pui-swatch', className)} style={{ background: color, ...style }} {...rest}>
      {label && <span className="pui-swatch__label">{label}</span>}
    </div>
  );
}
