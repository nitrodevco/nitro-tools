import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ItemCardProps {
  title: string;
  subtitle?: string;
  onRemove?: () => void;
  children: ReactNode;
  defaultOpen?: boolean;
  index?: number;
}

export function ItemCard({ title, subtitle, onRemove, children, defaultOpen = false, index }: ItemCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="bg-card/50">
      <div className="flex items-center justify-between px-3 py-2">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 flex-1 text-left hover:text-foreground text-muted-foreground transition-colors"
        >
          {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
          <span className="text-sm font-medium text-foreground">
            {index !== undefined ? `[${index}] ` : ''}
            {title}
          </span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </button>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      {open && <div className="px-3 pb-3 pt-1 border-t border-border/50 space-y-3">{children}</div>}
    </Card>
  );
}
