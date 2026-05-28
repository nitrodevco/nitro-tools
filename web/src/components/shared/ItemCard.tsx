import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Button } from '../ui/button';

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
    <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center">
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-2 px-3 py-2.5 hover:bg-accent/20 transition-colors text-left min-w-0"
        >
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          )}
          {index !== undefined && (
            <span className="text-[10px] text-muted-foreground/40 font-mono tabular-nums shrink-0">
              #{index}
            </span>
          )}
          <span className="text-sm font-medium flex-1 truncate">{title}</span>
          {subtitle && (
            <span className="text-xs text-muted-foreground/60 shrink-0">{subtitle}</span>
          )}
        </button>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 mr-1 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      {open && (
        <div className="px-3 pb-3 pt-2 border-t border-border/40 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
