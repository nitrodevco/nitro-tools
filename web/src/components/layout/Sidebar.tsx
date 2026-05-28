import {
  Box,
  Boxes,
  Cpu,
  Film,
  Home,
  Image,
  Images,
  Info,
  Link,
  Palette,
} from 'lucide-react';
import { useAssetStore } from '../../store/assetStore';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/badge';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  count?: number;
}

export function Sidebar({ className }: { className?: string }) {
  const { activeTab, setActiveTab, asset, images } = useAssetStore();

  const items: NavItem[] = [
    { id: 'general', label: 'General', icon: Info },
    { id: 'images', label: 'Images', icon: Images, count: images.length },
    { id: 'assets', label: 'Assets', icon: Box, count: asset.assets?.length },
    { id: 'aliases', label: 'Aliases', icon: Link, count: asset.aliases?.length },
    { id: 'palettes', label: 'Palettes', icon: Palette, count: asset.palettes?.length },
    { id: 'animations', label: 'Animations', icon: Film, count: asset.animations?.length },
    { id: 'visualizations', label: 'Visualizations', icon: Boxes, count: asset.visualizations?.length },
    { id: 'logic', label: 'Logic', icon: Cpu },
    { id: 'spritesheet', label: 'Spritesheet', icon: Image },
    { id: 'room', label: 'Room Viz', icon: Home },
  ];

  return (
    <div className={cn('w-52 border-r border-border bg-background shrink-0 flex-col', className)}>
      <div className="px-2 py-4 space-y-px">
        <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
          Sections
        </p>
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center justify-between gap-2 py-1.5 rounded-sm text-sm transition-colors',
                active
                  ? 'relative pl-3 border-l-2 border-primary text-foreground bg-primary/[0.06] font-medium'
                  : 'pl-3 border-l-2 border-transparent text-muted-foreground/70 hover:text-foreground hover:bg-accent/30',
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-[10px] h-4 px-1.5 min-w-[1.25rem] flex items-center justify-center tabular-nums mr-2',
                    active && 'bg-primary/15 text-primary border-transparent',
                  )}
                >
                  {item.count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
