import { FolderOpen, RefreshCw } from 'lucide-react';
import { useRef } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function Header() {
  const { asset, resetAsset, loadAsset, loadNitroBundle } = useAssetStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    if (file.name.endsWith('.json') || file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const result = loadAsset(text);
        if (!result.success) alert(`Failed to parse JSON: ${result.error}`);
      };
      reader.readAsText(file);
      return;
    }
    // Treat everything else (including .nitro and unknown types from iOS) as a .nitro bundle
    loadNitroBundle(file).then((result) => {
      if (!result.success) alert(`Failed to open file: ${result.error}`);
    });
  };

  return (
    <header className="h-12 sm:h-14 border-b border-border flex items-center justify-between px-3 sm:px-6 bg-background shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">N</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block">Nitro Asset Creator</span>
        </div>
        <Badge variant="outline" className="text-xs font-mono text-muted-foreground truncate max-w-[120px] sm:max-w-none">
          {asset.name || 'unnamed'}
        </Badge>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <input ref={fileRef} type="file" accept=".json,.nitro,application/json,application/zip,application/x-zip-compressed,application/octet-stream" className="hidden" onChange={handleImport} />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 sm:w-auto sm:px-3 sm:gap-1.5 text-xs"
              onClick={() => fileRef.current?.click()}
            >
              <FolderOpen className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Open</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open .nitro or .json</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 sm:w-auto sm:px-3 sm:gap-1.5 text-xs text-muted-foreground"
              onClick={resetAsset}
            >
              <RefreshCw className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset asset</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
