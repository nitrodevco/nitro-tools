import { FolderOpen, RefreshCw } from 'lucide-react';
import { useRef } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function Header() {
  const { asset, resetAsset, loadAsset } = useAssetStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const result = loadAsset(text);
      if (!result.success) alert(`Failed to parse JSON: ${result.error}`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">N</span>
          </div>
          <span className="font-semibold text-sm">Nitro Asset Creator</span>
        </div>
        <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
          {asset.name || 'unnamed'}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={() => fileRef.current?.click()}>
          <FolderOpen className="h-3.5 w-3.5" />
          Import JSON
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs text-muted-foreground" onClick={resetAsset}>
          <RefreshCw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
    </header>
  );
}
