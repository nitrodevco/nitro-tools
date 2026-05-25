import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface SectionHeaderProps {
  title: string;
  description?: string;
  count?: number;
  onAdd?: () => void;
  addLabel?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, description, count, onAdd, addLabel, children }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">{title}</h3>
          {count !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="flex gap-2">
        {children}
        {onAdd && (
          <Button size="sm" variant="outline" onClick={onAdd} className="gap-1 text-xs h-7">
            <Plus className="h-3 w-3" />
            {addLabel ?? 'Add'}
          </Button>
        )}
      </div>
    </div>
  );
}
