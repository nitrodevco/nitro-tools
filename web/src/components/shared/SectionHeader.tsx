import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface SectionHeaderProps {
  title?: string;
  description?: string;
  count?: number;
  onAdd?: () => void;
  addLabel?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, description, count, onAdd, addLabel, children }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        {title && (
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{title}</h3>
            {count !== undefined && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5 tabular-nums">
                {count}
              </Badge>
            )}
          </div>
        )}
        {!title && count !== undefined && (
          <Badge variant="secondary" className="text-[10px] h-4 px-1.5 tabular-nums">
            {count}
          </Badge>
        )}
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="flex gap-2">
        {children}
        {onAdd && (
          <Button size="sm" variant="outline" onClick={onAdd} className="h-7 gap-1 text-xs">
            <Plus className="h-3 w-3" />
            {addLabel ?? 'Add'}
          </Button>
        )}
      </div>
    </div>
  );
}
