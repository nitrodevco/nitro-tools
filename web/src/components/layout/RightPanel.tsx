import { Check, Clipboard, Download, FileArchive } from 'lucide-react';
import { useState } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { cn } from '../../utils/cn';
import { copyToClipboard, downloadJson, downloadNitroBundle } from '../../utils/export';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { SpritesheetPreview } from './SpritesheetPreview';

type PanelTab = 'preview' | 'json';

export function RightPanel() {
  const { asset, packedSheetUrl } = useAssetStore();
  const [tab, setTab] = useState<PanelTab>('preview');
  const [copied, setCopied] = useState(false);

  const json = JSON.stringify(asset, null, 2);

  const handleCopy = () => {
    copyToClipboard(asset);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full border-l border-border bg-background">
      {/* Tab bar + export actions */}
      <div className="flex items-center border-b border-border shrink-0">
        <div className="flex">
          {(['preview', 'json'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px',
                tab === t
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex gap-1 px-2">
          {tab === 'json' && (
            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1 h-7 text-xs px-2">
              {copied ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadJson(asset)}
            className="gap-1 h-7 text-xs px-2"
          >
            <Download className="h-3 w-3" />
            JSON
          </Button>
          <Button
            size="sm"
            onClick={() => downloadNitroBundle(asset, packedSheetUrl)}
            className="gap-1 h-7 text-xs px-2"
          >
            <FileArchive className="h-3 w-3" />
            .nitro
          </Button>
        </div>
      </div>

      {/* Panel body */}
      <div className="flex-1 min-h-0">
        {tab === 'preview' ? (
          <SpritesheetPreview />
        ) : (
          <ScrollArea className="h-full">
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <span className="text-xs text-muted-foreground/60">{json.length.toLocaleString()} chars</span>
            </div>
            <pre className="px-4 pb-4 text-xs font-mono text-emerald-400/90 leading-relaxed whitespace-pre overflow-x-auto bg-[#0d1117]">
              {json}
            </pre>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
