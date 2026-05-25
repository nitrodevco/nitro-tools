import { Loader2, Minus, Plus, Maximize2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { Button } from '../ui/button';

export function SpritesheetPreview() {
  const { packedSheetUrl, asset, isRepacking, selectedFrameName, setSelectedFrame } = useAssetStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [hoveredFrame, setHoveredFrame] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const frames = asset.spritesheet?.frames ?? {};
  const frameEntries = Object.entries(frames);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    if (!packedSheetUrl) {
      canvas.width = 360;
      canvas.height = 200;
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Checkerboard
      ctx.fillStyle = '#161b22';
      for (let cx = 0; cx < canvas.width; cx += 16) {
        for (let cy = 0; cy < canvas.height; cy += 16) {
          if ((Math.floor(cx / 16) + Math.floor(cy / 16)) % 2 === 0) {
            ctx.fillRect(cx, cy, 16, 16);
          }
        }
      }

      ctx.fillStyle = '#30363d';
      ctx.font = '13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('No images — upload sprites to see preview', canvas.width / 2, canvas.height / 2 - 8);
      ctx.font = '11px monospace';
      ctx.fillStyle = '#484f58';
      ctx.fillText('Go to the Images section to get started', canvas.width / 2, canvas.height / 2 + 12);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const w = Math.ceil(img.width * zoom);
      const h = Math.ceil(img.height * zoom);
      canvas.width = w;
      canvas.height = h;

      // Checkerboard background (shows transparency)
      const tileSize = Math.max(4, Math.round(8 * zoom));
      for (let cx = 0; cx < w; cx += tileSize) {
        for (let cy = 0; cy < h; cy += tileSize) {
          ctx.fillStyle = (Math.floor(cx / tileSize) + Math.floor(cy / tileSize)) % 2 === 0 ? '#1c2128' : '#0d1117';
          ctx.fillRect(cx, cy, tileSize, tileSize);
        }
      }

      // Draw spritesheet image
      ctx.imageSmoothingEnabled = zoom < 1;
      ctx.drawImage(img, 0, 0, w, h);

      // Draw frame overlays
      for (const [name, frame] of frameEntries) {
        const { x, y, w: fw, h: fh } = frame.frame;
        const sx = x * zoom;
        const sy = y * zoom;
        const sw = fw * zoom;
        const sh = fh * zoom;

        const isHov = name === hoveredFrame;
        const isSel = name === selectedFrameName;

        if (isHov || isSel) {
          ctx.fillStyle = isSel ? 'rgba(52,211,153,0.12)' : 'rgba(96,165,250,0.12)';
          ctx.fillRect(sx, sy, sw, sh);
        }

        ctx.strokeStyle = isSel ? '#34d399' : isHov ? '#60a5fa' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = isSel || isHov ? 1.5 : 0.5;
        ctx.strokeRect(sx + 0.5, sy + 0.5, sw - 1, sh - 1);
      }
    };
    img.src = packedSheetUrl;
  }, [packedSheetUrl, zoom, hoveredFrame, selectedFrameName, frameEntries]);

  useEffect(() => { draw(); }, [draw]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / zoom;
    const my = (e.clientY - rect.top) / zoom;

    let found: string | null = null;
    for (const [name, frame] of frameEntries) {
      const { x, y, w, h } = frame.frame;
      if (mx >= x && mx < x + w && my >= y && my < y + h) {
        found = name;
        break;
      }
    }
    setHoveredFrame(found);
    if (found) setTooltipPos({ x: e.clientX - (containerRef.current?.getBoundingClientRect().left ?? 0), y: e.clientY - (containerRef.current?.getBoundingClientRect().top ?? 0) });
    else setTooltipPos(null);
  };

  const handleMouseLeave = () => { setHoveredFrame(null); setTooltipPos(null); };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / zoom;
    const my = (e.clientY - rect.top) / zoom;

    for (const [name, frame] of frameEntries) {
      const { x, y, w, h } = frame.frame;
      if (mx >= x && mx < x + w && my >= y && my < y + h) {
        setSelectedFrame(selectedFrameName === name ? null : name);
        return;
      }
    }
    setSelectedFrame(null);
  };

  const fitToContainer = () => {
    if (!packedSheetUrl || !containerRef.current) return;
    const img = new Image();
    img.onload = () => {
      const containerW = containerRef.current!.clientWidth - 16;
      setZoom(Math.min(1, containerW / img.width));
    };
    img.src = packedSheetUrl;
  };

  const sheetMeta = asset.spritesheet?.meta;
  const selectedFrame = selectedFrameName ? frames[selectedFrameName] : null;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0 bg-[#0d1117]">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preview</span>
          {sheetMeta && (
            <span className="text-xs text-muted-foreground font-mono">
              {sheetMeta.size.w}×{sheetMeta.size.h}
            </span>
          )}
          {isRepacking && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoom((z) => Math.min(4, z + 0.25))}>
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={fitToContainer} title="Fit to width">
            <Maximize2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-[#0d1117] relative"
        style={{ minHeight: 0 }}
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="block"
          style={{ cursor: hoveredFrame ? 'pointer' : 'default' }}
        />

        {/* Hover tooltip */}
        {tooltipPos && hoveredFrame && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{ left: tooltipPos.x + 10, top: tooltipPos.y + 10 }}
          >
            <div className="bg-background border border-border rounded px-2 py-1 text-xs font-mono shadow-lg">
              <div className="font-semibold text-foreground">{hoveredFrame}</div>
              {frames[hoveredFrame] && (
                <div className="text-muted-foreground">
                  {frames[hoveredFrame].frame.w}×{frames[hoveredFrame].frame.h} @({frames[hoveredFrame].frame.x},{frames[hoveredFrame].frame.y})
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected frame info bar */}
      {selectedFrame && selectedFrameName && (
        <div className="shrink-0 px-3 py-2 border-t border-border bg-background flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-xs text-muted-foreground">Frame: </span>
            <span className="text-xs font-mono font-semibold">{selectedFrameName}</span>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {selectedFrame.frame.w}×{selectedFrame.frame.h} @ ({selectedFrame.frame.x}, {selectedFrame.frame.y})
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            pivot ({selectedFrame.pivot.x}, {selectedFrame.pivot.y})
          </div>
          <button onClick={() => setSelectedFrame(null)} className="text-xs text-muted-foreground hover:text-foreground ml-auto">
            ✕ deselect
          </button>
        </div>
      )}

      {/* Frame count summary */}
      <div className="shrink-0 px-3 py-1.5 border-t border-border bg-background">
        <span className="text-xs text-muted-foreground">
          {frameEntries.length} frame{frameEntries.length !== 1 ? 's' : ''}
          {selectedFrameName ? ` · selected: ${selectedFrameName}` : ''}
        </span>
      </div>
    </div>
  );
}
