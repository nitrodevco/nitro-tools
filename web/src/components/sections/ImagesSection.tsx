import { ImagePlus, Loader2, Trash2, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function ImagesSection() {
  const { images, isRepacking, addImages, removeImage, clearImages, setSelectedFrame, selectedFrameName } =
    useAssetStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const pngs = Array.from(files).filter((f) => f.type === 'image/png' || f.name.endsWith('.png'));
      if (pngs.length) addImages(pngs);
    },
    [addImages],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/20'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className={`h-8 w-8 ${dragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className="text-sm font-medium">Drop PNG files here or click to browse</p>
          <p className="text-xs text-muted-foreground">
            Images are auto-packed into a spritesheet and referenced as assets
          </p>
        </div>
        {isRepacking && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      {/* Header + controls */}
      {images.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Uploaded Images</span>
            <Badge variant="secondary" className="text-xs">{images.length}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearImages}
            className="h-7 text-xs text-muted-foreground hover:text-destructive gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}

      {/* Image grid */}
      {images.length === 0 && (
        <div className="text-center py-6 text-sm text-muted-foreground">
          No images uploaded yet.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {images.map((img) => {
          const isSelected = selectedFrameName === img.name;
          return (
            <div
              key={img.id}
              onClick={() => setSelectedFrame(isSelected ? null : img.name)}
              className={`
                group relative border rounded-lg overflow-hidden cursor-pointer transition-colors
                ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/40'}
              `}
            >
              {/* Thumbnail */}
              <div className="bg-[#0d1117] flex items-center justify-center p-2 aspect-square relative">
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="max-w-full max-h-full object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
                {/* Checkerboard bg for transparency */}
                <div
                  className="absolute inset-0 -z-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                  }}
                />
              </div>

              {/* Info */}
              <div className="px-2 py-1.5 bg-card">
                <p className="text-xs font-mono truncate">{img.name}</p>
                <p className="text-xs text-muted-foreground">
                  {img.width}×{img.height}
                </p>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(img.id);
                }}
                className="absolute top-1 right-1 h-5 w-5 rounded bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>

              {isSelected && (
                <div className="absolute top-1 left-1">
                  <Badge className="text-xs h-4 px-1 bg-primary text-primary-foreground">selected</Badge>
                </div>
              )}
            </div>
          );
        })}

        {/* Add more button */}
        {images.length > 0 && (
          <button
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg aspect-square flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">Add more</span>
          </button>
        )}
      </div>
    </div>
  );
}
