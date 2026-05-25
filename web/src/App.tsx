import { TooltipProvider } from './components/ui/tooltip';
import { ScrollArea } from './components/ui/scroll-area';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { RightPanel } from './components/layout/RightPanel';
import { GeneralSection } from './components/sections/GeneralSection';
import { ImagesSection } from './components/sections/ImagesSection';
import { AssetsSection } from './components/sections/AssetsSection';
import { AliasesSection } from './components/sections/AliasesSection';
import { PalettesSection } from './components/sections/PalettesSection';
import { AnimationsSection } from './components/sections/AnimationsSection';
import { VisualizationsSection } from './components/sections/VisualizationsSection';
import { LogicSection } from './components/sections/LogicSection';
import { SpritesheetSection } from './components/sections/SpritesheetSection';
import { RoomVisualizationSection } from './components/sections/RoomVisualizationSection';
import { useAssetStore } from './store/assetStore';

const sectionComponents: Record<string, React.ComponentType> = {
  general: GeneralSection,
  images: ImagesSection,
  assets: AssetsSection,
  aliases: AliasesSection,
  palettes: PalettesSection,
  animations: AnimationsSection,
  visualizations: VisualizationsSection,
  logic: LogicSection,
  spritesheet: SpritesheetSection,
  room: RoomVisualizationSection,
};

const sectionTitles: Record<string, string> = {
  general: 'General',
  images: 'Images',
  assets: 'Assets',
  aliases: 'Aliases',
  palettes: 'Palettes',
  animations: 'Animations',
  visualizations: 'Visualizations',
  logic: 'Logic',
  spritesheet: 'Spritesheet',
  room: 'Room Visualization',
};

const sectionDescriptions: Record<string, string> = {
  general: 'Core asset metadata: name, type, and renderer configuration.',
  images: 'Upload PNG sprites — they are auto-packed into an atlas and wired into assets & spritesheet.',
  assets: 'Individual sprite asset entries. Auto-populated when images are uploaded.',
  aliases: 'Name aliases pointing to existing assets with optional flip.',
  palettes: 'Color palettes for pet and figure colorization.',
  animations: 'Sprite animation sequences, frames, and direction offsets.',
  visualizations: 'Per-size rendering configurations with layers, colors, and animations.',
  logic: 'Collision model, dimensions, sounds, particles, and action handlers.',
  spritesheet: 'Atlas metadata and frame definitions. Auto-updated when images are uploaded.',
  room: 'Floor, wall, and landscape material/texture data for room types.',
};

function ActiveSection() {
  const { activeTab } = useAssetStore();
  const Component = sectionComponents[activeTab] ?? GeneralSection;
  const title = sectionTitles[activeTab] ?? 'Section';
  const desc = sectionDescriptions[activeTab] ?? '';

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-5 pb-4 border-b border-border shrink-0">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Component />
        </div>
      </ScrollArea>
    </div>
  );
}

export default function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <Header />
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <div className="flex flex-1 min-w-0">
            {/* Editor panel */}
            <div className="flex flex-col flex-1 min-w-0 min-h-0">
              <ActiveSection />
            </div>
            {/* Right panel: Preview + JSON */}
            <div className="w-[460px] shrink-0 flex flex-col min-h-0">
              <RightPanel />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
