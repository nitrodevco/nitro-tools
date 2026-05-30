import { Check, Clipboard, Download, FileArchive } from 'lucide-react';
import { useState } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { copyToClipboard, downloadJson, downloadNitroBundle } from '../../utils/export';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

export function JsonPreview() {
  const { asset } = useAssetStore();
  const [copied, setCopied] = useState(false);

  const json = JSON.stringify(asset, null, 2);

  const handleCopy = () => {
    copyToClipboard(asset);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full border-l border-border bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div>
          <p className="text-sm font-semibold">JSON Preview</p>
          <p className="text-xs text-muted-foreground">{json.length.toLocaleString()} chars</p>
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 h-7 text-xs">
            {copied ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => downloadJson(asset)} className="gap-1.5 h-7 text-xs">
            <Download className="h-3 w-3" />
            JSON
          </Button>
          <Button size="sm" onClick={() => downloadNitroBundle(asset)} className="gap-1.5 h-7 text-xs">
            <FileArchive className="h-3 w-3" />
            .nitro
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <pre className="p-4 text-xs font-mono text-green-400 leading-relaxed whitespace-pre overflow-x-auto bg-[#0d1117]">
          {json}
        </pre>
      </ScrollArea>
    </div>
  );
}
