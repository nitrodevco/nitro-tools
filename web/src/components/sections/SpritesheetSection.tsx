import { X } from 'lucide-react';
import { useState } from 'react';
import type { ISpritesheetFrame } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { Field } from '../shared/Field';
import { FormRow } from '../shared/FormRow';
import { SectionHeader } from '../shared/SectionHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

interface FrameRowProps {
  name: string;
  frame: ISpritesheetFrame;
  onChange: (name: string, frame: ISpritesheetFrame) => void;
  onRemove: () => void;
}

function FrameRow({ name, frame, onChange, onRemove }: FrameRowProps) {
  const [expanded, setExpanded] = useState(false);
  const upd = (patch: Partial<ISpritesheetFrame>) => onChange(name, { ...frame, ...patch });
  const updFrame = (patch: Partial<ISpritesheetFrame['frame']>) => upd({ frame: { ...frame.frame, ...patch } });
  const updSrc = (patch: Partial<ISpritesheetFrame['spriteSourceSize']>) =>
    upd({ spriteSourceSize: { ...frame.spriteSourceSize, ...patch } });
  const updSize = (patch: Partial<ISpritesheetFrame['sourceSize']>) =>
    upd({ sourceSize: { ...frame.sourceSize, ...patch } });
  const updPivot = (patch: Partial<ISpritesheetFrame['pivot']>) => upd({ pivot: { ...frame.pivot, ...patch } });

  return (
    <div className="border border-border/50 rounded-md">
      <div className="flex items-center gap-2 px-3 py-2">
        <button onClick={() => setExpanded(!expanded)} className="text-xs font-mono text-muted-foreground hover:text-foreground flex-1 text-left truncate">
          {name}
        </button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border/50 space-y-3">
          <Field label="Frame Key Name">
            <Input value={name} onChange={(e) => onChange(e.target.value, frame)} className="font-mono text-xs" />
          </Field>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Frame Rect</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Field label="X"><Input type="number" value={frame.frame.x} onChange={(e) => updFrame({ x: Number(e.target.value) })} className="h-7 text-xs" /></Field>
              <Field label="Y"><Input type="number" value={frame.frame.y} onChange={(e) => updFrame({ y: Number(e.target.value) })} className="h-7 text-xs" /></Field>
              <Field label="W"><Input type="number" value={frame.frame.w} onChange={(e) => updFrame({ w: Number(e.target.value) })} className="h-7 text-xs" /></Field>
              <Field label="H"><Input type="number" value={frame.frame.h} onChange={(e) => updFrame({ h: Number(e.target.value) })} className="h-7 text-xs" /></Field>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Sprite Source Size</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Field label="X"><Input type="number" value={frame.spriteSourceSize.x} onChange={(e) => updSrc({ x: Number(e.target.value) })} className="h-7 text-xs" /></Field>
              <Field label="Y"><Input type="number" value={frame.spriteSourceSize.y} onChange={(e) => updSrc({ y: Number(e.target.value) })} className="h-7 text-xs" /></Field>
              <Field label="W"><Input type="number" value={frame.spriteSourceSize.w} onChange={(e) => updSrc({ w: Number(e.target.value) })} className="h-7 text-xs" /></Field>
              <Field label="H"><Input type="number" value={frame.spriteSourceSize.h} onChange={(e) => updSrc({ h: Number(e.target.value) })} className="h-7 text-xs" /></Field>
            </div>
          </div>
          <FormRow cols={4}>
            <Field label="Source W"><Input type="number" value={frame.sourceSize.w} onChange={(e) => updSize({ w: Number(e.target.value) })} className="h-7 text-xs" /></Field>
            <Field label="Source H"><Input type="number" value={frame.sourceSize.h} onChange={(e) => updSize({ h: Number(e.target.value) })} className="h-7 text-xs" /></Field>
            <Field label="Pivot X"><Input type="number" step="0.01" value={frame.pivot.x} onChange={(e) => updPivot({ x: Number(e.target.value) })} className="h-7 text-xs" /></Field>
            <Field label="Pivot Y"><Input type="number" step="0.01" value={frame.pivot.y} onChange={(e) => updPivot({ y: Number(e.target.value) })} className="h-7 text-xs" /></Field>
          </FormRow>
        </div>
      )}
    </div>
  );
}

const defaultFrame = (): ISpritesheetFrame => ({
  frame: { x: 0, y: 0, w: 64, h: 64 },
  rotated: false,
  trimmed: false,
  spriteSourceSize: { x: 0, y: 0, w: 64, h: 64 },
  sourceSize: { w: 64, h: 64 },
  pivot: { x: 0.5, y: 1.0 },
});

export function SpritesheetSection() {
  const { asset, updateAsset } = useAssetStore();
  const spritesheet = asset.spritesheet ?? {};
  const meta = spritesheet.meta ?? {
    app: 'Nitro Asset Creator',
    version: '1.0',
    image: `${asset.name ?? 'asset'}.png`,
    format: 'RGBA8888',
    size: { w: 512, h: 512 },
    scale: '1',
  };
  const frames = spritesheet.frames ?? {};
  const frameEntries = Object.entries(frames);

  const updMeta = (patch: Partial<typeof meta>) =>
    updateAsset({ spritesheet: { ...spritesheet, meta: { ...meta, ...patch } } });

  const updFrames = (newFrames: typeof frames) =>
    updateAsset({ spritesheet: { ...spritesheet, frames: newFrames } });

  const addFrame = () => {
    const key = `frame_${frameEntries.length}`;
    updFrames({ ...frames, [key]: defaultFrame() });
  };

  const renameFrame = (oldKey: string, newKey: string, frame: ISpritesheetFrame) => {
    const newFrames: typeof frames = {};
    for (const [k, v] of frameEntries) {
      newFrames[k === oldKey ? newKey : k] = k === oldKey ? frame : v;
    }
    updFrames(newFrames);
  };

  const updateFrame = (key: string, frame: ISpritesheetFrame) => updFrames({ ...frames, [key]: frame });
  const removeFrame = (key: string) => {
    const { [key]: _, ...rest } = frames;
    updFrames(rest);
  };

  return (
    <div className="space-y-5">
      {/* Metadata */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Metadata</p>
        <FormRow cols={2}>
          <Field label="Image File">
            <Input value={meta.image} onChange={(e) => updMeta({ image: e.target.value })} placeholder="asset.png" />
          </Field>
          <Field label="Format">
            <Input value={meta.format} onChange={(e) => updMeta({ format: e.target.value })} placeholder="RGBA8888" />
          </Field>
        </FormRow>
        <FormRow cols={4}>
          <Field label="Width">
            <Input type="number" value={meta.size.w} onChange={(e) => updMeta({ size: { ...meta.size, w: Number(e.target.value) } })} />
          </Field>
          <Field label="Height">
            <Input type="number" value={meta.size.h} onChange={(e) => updMeta({ size: { ...meta.size, h: Number(e.target.value) } })} />
          </Field>
          <Field label="Scale">
            <Input value={meta.scale} onChange={(e) => updMeta({ scale: e.target.value })} placeholder="1" />
          </Field>
          <Field label="App">
            <Input value={meta.app} onChange={(e) => updMeta({ app: e.target.value })} />
          </Field>
        </FormRow>
      </div>

      <Separator />

      {/* Frames */}
      <SectionHeader
        title="Frames"
        description="Individual sprite frame definitions"
        count={frameEntries.length}
        onAdd={addFrame}
        addLabel="Add Frame"
      />
      <div className="space-y-1.5">
        {frameEntries.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            No frames defined. Click "Add Frame" to start.
          </p>
        )}
        {frameEntries.map(([key, frame]) => (
          <FrameRow
            key={key}
            name={key}
            frame={frame}
            onChange={(newName, newFrame) => {
              if (newName !== key) renameFrame(key, newName, newFrame);
              else updateFrame(key, newFrame);
            }}
            onRemove={() => removeFrame(key)}
          />
        ))}
      </div>
    </div>
  );
}
