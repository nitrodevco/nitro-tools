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

const items = [
  { id: 'general',       label: 'General',   icon: Info },
  { id: 'images',        label: 'Images',    icon: Images },
  { id: 'assets',        label: 'Assets',    icon: Box },
  { id: 'aliases',       label: 'Aliases',   icon: Link },
  { id: 'palettes',      label: 'Palettes',  icon: Palette },
  { id: 'animations',    label: 'Anim.',     icon: Film },
  { id: 'visualizations',label: 'Viz.',      icon: Boxes },
  { id: 'logic',         label: 'Logic',     icon: Cpu },
  { id: 'spritesheet',   label: 'Sheet',     icon: Image },
  { id: 'room',          label: 'Room',      icon: Home },
] as const;

export function MobileNav() {
  const { activeTab, setActiveTab } = useAssetStore();

  return (
    <nav className="lg:hidden shrink-0 border-t border-border bg-background">
      <div className="flex overflow-x-auto scrollbar-none">
        {items.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[56px] flex-shrink-0 transition-colors',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
              {active && (
                <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary translate-y-0" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
