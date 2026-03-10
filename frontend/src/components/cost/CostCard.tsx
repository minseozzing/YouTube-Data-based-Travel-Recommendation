import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CostCardProps {
  children: ReactNode;
  title?: string;
  headerRight?: ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export function CostCard({
  children,
  title,
  headerRight,
  className,
  contentClassName,
  noPadding = false,
}: CostCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl overflow-hidden', className)}>
      {(title || headerRight) && (
        <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
          {title && (
            <span className="text-sm font-semibold text-foreground">
              {title}
            </span>
          )}
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      <div className={cn(!noPadding && 'p-4', contentClassName)}>
        {children}
      </div>
    </div>
  );
}
