import { Check, Clipboard, Download, FileArchive } from 'lucide-react';
import { useState } from 'react';
import { useAssetStore } from '../../store/assetStore';
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
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0 gap-2">
        <div className="flex rounded-md overflow-hidden border border-border">
          <button
            onClick={() => setTab('preview')}
            className={`px-3 py-1 text-xs font-medium transition-colors ${
              tab === 'preview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setTab('json')}
            className={`px-3 py-1 text-xs font-medium transition-colors border-l border-border ${
              tab === 'json' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            JSON
          </button>
        </div>

        <div className="flex gap-1">
          {tab === 'json' && (
            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1 h-7 text-xs px-2">
              {copied ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => downloadJson(asset)} className="gap-1 h-7 text-xs px-2">
            <Download className="h-3 w-3" />
            JSON
          </Button>
          <Button size="sm" onClick={() => downloadNitroBundle(asset, packedSheetUrl)} className="gap-1 h-7 text-xs px-2">
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
              <span className="text-xs text-muted-foreground">{json.length.toLocaleString()} chars</span>
            </div>
            <pre className="px-4 pb-4 text-xs font-mono text-green-400 leading-relaxed whitespace-pre overflow-x-auto bg-[#0d1117]">
              {json}
            </pre>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
