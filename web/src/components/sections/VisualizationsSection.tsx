import { X } from 'lucide-react';
import type {
  IAssetColor,
  IAssetColorLayer,
  IAssetGesture,
  IAssetPosture,
  IAssetVisualAnimation,
  IAssetVisualAnimationLayer,
  IAssetVisualAnimationSequence,
  IAssetVisualAnimationSequenceFrame,
  IAssetVisualizationData,
  IAssetVisualizationDirection,
  IAssetVisualizationLayer,
} from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { Field } from '../shared/Field';
import { FormRow } from '../shared/FormRow';
import { ItemCard } from '../shared/ItemCard';
import { SectionHeader } from '../shared/SectionHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';

// ── Layer editor ──────────────────────────────────────────────────────────────

function LayerEditor({
  layer,
  onChange,
  onRemove,
}: {
  layer: IAssetVisualizationLayer;
  onChange: (l: IAssetVisualizationLayer) => void;
  onRemove: () => void;
}) {
  const upd = (p: Partial<IAssetVisualizationLayer>) => onChange({ ...layer, ...p });
  return (
    <div className="p-2 bg-muted/20 rounded border border-border/40 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Layer {layer.id ?? '?'}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Field label="ID"><Input type="number" value={layer.id ?? 0} onChange={(e) => upd({ id: Number(e.target.value) })} className="h-7 text-xs" /></Field>
        <Field label="X"><Input type="number" value={layer.x ?? 0} onChange={(e) => upd({ x: Number(e.target.value) })} className="h-7 text-xs" /></Field>
        <Field label="Y"><Input type="number" value={layer.y ?? 0} onChange={(e) => upd({ y: Number(e.target.value) })} className="h-7 text-xs" /></Field>
        <Field label="Z"><Input type="number" value={layer.z ?? 0} onChange={(e) => upd({ z: Number(e.target.value) })} className="h-7 text-xs" /></Field>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Alpha"><Input type="number" min={0} max={255} value={layer.alpha ?? 255} onChange={(e) => upd({ alpha: Number(e.target.value) })} className="h-7 text-xs" /></Field>
        <Field label="Ink"><Input value={layer.ink ?? ''} onChange={(e) => upd({ ink: e.target.value })} placeholder="ADD" className="h-7 text-xs" /></Field>
        <Field label="Tag"><Input value={layer.tag ?? ''} onChange={(e) => upd({ tag: e.target.value })} className="h-7 text-xs" /></Field>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={layer.ignoreMouse ?? false} onCheckedChange={(v) => upd({ ignoreMouse: v })} />
        <Label className="text-xs">Ignore Mouse</Label>
      </div>
    </div>
  );
}

// ── Color editor ──────────────────────────────────────────────────────────────

function ColorEditor({
  color,
  onChange,
  onRemove,
}: {
  color: IAssetColor;
  onChange: (c: IAssetColor) => void;
  onRemove: () => void;
}) {
  const upd = (p: Partial<IAssetColor>) => onChange({ ...color, ...p });
  const layers: IAssetColorLayer[] = color.layers ?? [];
  return (
    <div className="p-2 bg-muted/20 rounded border border-border/40 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Color {color.id ?? '?'}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      <Field label="ID"><Input type="number" value={color.id ?? 0} onChange={(e) => upd({ id: Number(e.target.value) })} className="h-7 text-xs" /></Field>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground">Color Layers</Label>
          <Button size="sm" variant="outline" className="h-5 text-xs" onClick={() => upd({ layers: [...layers, { id: layers.length, color: 0xffffff }] })}>+ Layer</Button>
        </div>
        {layers.map((cl, ci) => (
          <div key={ci} className="flex gap-2 items-center">
            <Input type="number" value={cl.id ?? 0} onChange={(e) => { const n=[...layers];n[ci]={...cl,id:Number(e.target.value)};upd({layers:n}); }} className="h-6 text-xs w-16" placeholder="ID" />
            <Input type="number" value={cl.color ?? 0} onChange={(e) => { const n=[...layers];n[ci]={...cl,color:Number(e.target.value)};upd({layers:n}); }} className="h-6 text-xs flex-1" placeholder="color (int)" />
            <div className="w-5 h-5 rounded border" style={{backgroundColor:`#${((cl.color??0)>>>0).toString(16).padStart(6,'0')}`}} />
            <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={()=>upd({layers:layers.filter((_,idx)=>idx!==ci)})}><X className="h-2.5 w-2.5"/></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Visual Animation editor ────────────────────────────────────────────────────

function VisualAnimationEditor({
  anim,
  onChange,
  onRemove,
}: {
  anim: IAssetVisualAnimation;
  onChange: (a: IAssetVisualAnimation) => void;
  onRemove: () => void;
}) {
  const upd = (p: Partial<IAssetVisualAnimation>) => onChange({ ...anim, ...p });
  const layers: IAssetVisualAnimationLayer[] = anim.layers ?? [];

  return (
    <div className="p-2 bg-muted/20 rounded border border-border/40 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Anim ID {anim.id ?? '?'}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="ID"><Input type="number" value={anim.id ?? 0} onChange={(e) => upd({ id: Number(e.target.value) })} className="h-7 text-xs" /></Field>
        <Field label="Transition To"><Input type="number" value={anim.transitionTo ?? ''} onChange={(e) => upd({ transitionTo: e.target.value?Number(e.target.value):undefined })} className="h-7 text-xs" placeholder="opt" /></Field>
        <Field label="Transition From"><Input type="number" value={anim.transitionFrom ?? ''} onChange={(e) => upd({ transitionFrom: e.target.value?Number(e.target.value):undefined })} className="h-7 text-xs" placeholder="opt" /></Field>
        <Field label="Immediate Change From"><Input value={anim.immediateChangeFrom ?? ''} onChange={(e) => upd({ immediateChangeFrom: e.target.value||undefined })} className="h-7 text-xs" placeholder="opt" /></Field>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={anim.randomStart ?? false} onCheckedChange={(v) => upd({ randomStart: v })} />
        <Label className="text-xs">Random Start</Label>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground">Layers</Label>
          <Button size="sm" variant="outline" className="h-5 text-xs" onClick={() => upd({ layers: [...layers, { id: layers.length }] })}>+ Layer</Button>
        </div>
        {layers.map((al, ali) => {
          const updLayer = (p: Partial<IAssetVisualAnimationLayer>) => {
            const n = [...layers]; n[ali] = { ...al, ...p }; upd({ layers: n });
          };
          const seqs: IAssetVisualAnimationSequence[] = al.frameSequences ?? [];
          return (
            <div key={ali} className="p-2 rounded bg-muted/30 border border-border/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Layer {al.id ?? ali}</span>
                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => upd({ layers: layers.filter((_,i)=>i!==ali) })}><X className="h-2.5 w-2.5"/></Button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                <Field label="ID"><Input type="number" value={al.id??0} onChange={e=>updLayer({id:Number(e.target.value)})} className="h-6 text-xs" /></Field>
                <Field label="Loop"><Input type="number" value={al.loopCount??0} onChange={e=>updLayer({loopCount:Number(e.target.value)})} className="h-6 text-xs" /></Field>
                <Field label="Frame Rpt"><Input type="number" value={al.frameRepeat??0} onChange={e=>updLayer({frameRepeat:Number(e.target.value)})} className="h-6 text-xs" /></Field>
                <Field label="Random"><Input type="number" value={al.random??0} onChange={e=>updLayer({random:Number(e.target.value)})} className="h-6 text-xs" /></Field>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-muted-foreground/70">Frame Sequences</Label>
                  <Button size="sm" variant="outline" className="h-4 text-xs" onClick={()=>updLayer({frameSequences:[...seqs,{frames:[]}]})}>+ Seq</Button>
                </div>
                {seqs.map((seq, si) => {
                  const updSeq=(p:Partial<IAssetVisualAnimationSequence>)=>{const n=[...seqs];n[si]={...seq,...p};updLayer({frameSequences:n});};
                  const frames: IAssetVisualAnimationSequenceFrame[] = seq.frames ?? [];
                  return (
                    <div key={si} className="p-1.5 rounded bg-muted/20 border border-border/20 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground/60">Seq {si}</span>
                        <Button variant="ghost" size="icon" className="h-4 w-4" onClick={()=>updLayer({frameSequences:seqs.filter((_,i)=>i!==si)})}><X className="h-2 w-2"/></Button>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <Field label="Loop"><Input type="number" value={seq.loopCount??0} onChange={e=>updSeq({loopCount:Number(e.target.value)})} className="h-5 text-xs" /></Field>
                        <Field label="Random"><Input type="number" value={seq.random??0} onChange={e=>updSeq({random:Number(e.target.value)})} className="h-5 text-xs" /></Field>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-xs text-muted-foreground/60">Frames</Label>
                        <Button size="sm" variant="outline" className="h-4 text-xs" onClick={()=>updSeq({frames:[...frames,{id:frames.length}]})}>+ Frame</Button>
                      </div>
                      {frames.map((fr,fi)=>{
                        const updFr=(p:Partial<IAssetVisualAnimationSequenceFrame>)=>{const n=[...frames];n[fi]={...fr,...p};updSeq({frames:n});};
                        return (
                          <div key={fi} className="flex gap-1 items-end">
                            <Field label="ID"><Input type="number" value={fr.id??fi} onChange={e=>updFr({id:Number(e.target.value)})} className="h-5 text-xs w-12" /></Field>
                            <Field label="X"><Input type="number" value={fr.x??0} onChange={e=>updFr({x:Number(e.target.value)})} className="h-5 text-xs w-12" /></Field>
                            <Field label="Y"><Input type="number" value={fr.y??0} onChange={e=>updFr({y:Number(e.target.value)})} className="h-5 text-xs w-12" /></Field>
                            <Button variant="ghost" size="icon" className="h-5 w-5 mb-0.5" onClick={()=>updSeq({frames:frames.filter((_,i)=>i!==fi)})}><X className="h-2 w-2"/></Button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Direction editor ──────────────────────────────────────────────────────────

function DirectionEditor({
  dir,
  onChange,
  onRemove,
}: {
  dir: IAssetVisualizationDirection;
  onChange: (d: IAssetVisualizationDirection) => void;
  onRemove: () => void;
}) {
  const upd = (p: Partial<IAssetVisualizationDirection>) => onChange({ ...dir, ...p });
  const layers: IAssetVisualizationLayer[] = dir.layers ?? [];
  return (
    <div className="p-2 bg-muted/20 rounded border border-border/40 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Direction {dir.id ?? '?'}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      <Field label="ID"><Input type="number" value={dir.id ?? 0} onChange={(e) => upd({ id: Number(e.target.value) })} className="h-7 text-xs" /></Field>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground">Layers</Label>
          <Button size="sm" variant="outline" className="h-5 text-xs" onClick={() => upd({ layers: [...layers, { id: layers.length }] })}>+ Layer</Button>
        </div>
        {layers.map((l, li) => (
          <LayerEditor key={li} layer={l} onChange={(v) => { const n=[...layers];n[li]=v;upd({layers:n}); }} onRemove={() => upd({ layers: layers.filter((_,i)=>i!==li) })} />
        ))}
      </div>
    </div>
  );
}

// ── Gestures / Postures ───────────────────────────────────────────────────────

function GesturePostureEditor<T extends IAssetGesture | IAssetPosture>({
  items,
  onChange,
  label,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">{label}</Label>
        <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => onChange([...items, { id: '', animationId: 0 } as T])}>Add</Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input value={item.id ?? ''} onChange={(e) => { const n=[...items];n[i]={...item,id:e.target.value};onChange(n); }} placeholder="ID (e.g. std)" className="h-7 text-xs flex-1" />
          <Input type="number" value={item.animationId ?? 0} onChange={(e) => { const n=[...items];n[i]={...item,animationId:Number(e.target.value)};onChange(n); }} className="h-7 text-xs w-20" placeholder="anim ID" />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onChange(items.filter((_,idx)=>idx!==i))}><X className="h-3 w-3"/></Button>
        </div>
      ))}
    </div>
  );
}

// ── Visualization entry ───────────────────────────────────────────────────────

function VisualizationEntry({
  viz,
  index,
  onChange,
  onRemove,
}: {
  viz: IAssetVisualizationData;
  index: number;
  onChange: (v: IAssetVisualizationData) => void;
  onRemove: () => void;
}) {
  const upd = (p: Partial<IAssetVisualizationData>) => onChange({ ...viz, ...p });
  const layers = viz.layers ?? [];
  const colors = viz.colors ?? [];
  const directions = viz.directions ?? [];
  const animations = viz.animations ?? [];
  const gestures = viz.gestures ?? [];
  const postures = viz.postures?.postures ?? [];

  return (
    <ItemCard title={`Visualization (size=${viz.size ?? '?'})`} onRemove={onRemove} index={index}>
      <FormRow cols={3}>
        <Field label="Size" hint="Rendering size (32, 64)">
          <Input type="number" value={viz.size ?? 64} onChange={(e) => upd({ size: Number(e.target.value) })} />
        </Field>
        <Field label="Layer Count">
          <Input type="number" value={viz.layerCount ?? 0} onChange={(e) => upd({ layerCount: Number(e.target.value) })} />
        </Field>
        <Field label="Angle">
          <Input type="number" value={viz.angle ?? 45} onChange={(e) => upd({ angle: Number(e.target.value) })} />
        </Field>
      </FormRow>

      <Separator />

      {/* Layers */}
      <div className="space-y-2">
        <SectionHeader title="Layers" count={layers.length} onAdd={() => upd({ layers: [...layers, { id: layers.length }] })} addLabel="Add Layer" />
        {layers.map((l, li) => (
          <LayerEditor key={li} layer={l} onChange={(v) => { const n=[...layers];n[li]=v;upd({layers:n}); }} onRemove={() => upd({ layers: layers.filter((_,i)=>i!==li) })} />
        ))}
      </div>

      <Separator />

      {/* Colors */}
      <div className="space-y-2">
        <SectionHeader title="Colors" count={colors.length} onAdd={() => upd({ colors: [...colors, { id: colors.length, layers: [] }] })} addLabel="Add Color" />
        {colors.map((c, ci) => (
          <ColorEditor key={ci} color={c} onChange={(v) => { const n=[...colors];n[ci]=v;upd({colors:n}); }} onRemove={() => upd({ colors: colors.filter((_,i)=>i!==ci) })} />
        ))}
      </div>

      <Separator />

      {/* Directions */}
      <div className="space-y-2">
        <SectionHeader title="Directions" count={directions.length} onAdd={() => upd({ directions: [...directions, { id: directions.length, layers: [] }] })} addLabel="Add Dir" />
        {directions.map((d, di) => (
          <DirectionEditor key={di} dir={d} onChange={(v) => { const n=[...directions];n[di]=v;upd({directions:n}); }} onRemove={() => upd({ directions: directions.filter((_,i)=>i!==di) })} />
        ))}
      </div>

      <Separator />

      {/* Visual Animations */}
      <div className="space-y-2">
        <SectionHeader title="Animations" count={animations.length} onAdd={() => upd({ animations: [...animations, { id: animations.length, layers: [] }] })} addLabel="Add Anim" />
        {animations.map((a, ai) => (
          <VisualAnimationEditor key={ai} anim={a} onChange={(v) => { const n=[...animations];n[ai]=v;upd({animations:n}); }} onRemove={() => upd({ animations: animations.filter((_,i)=>i!==ai) })} />
        ))}
      </div>

      <Separator />

      {/* Postures & Gestures */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Field label="Default Posture">
            <Input value={viz.defaultPosture ?? ''} onChange={(e) => upd({ defaultPosture: e.target.value })} placeholder="std" />
          </Field>
        </div>
        <GesturePostureEditor
          label="Postures"
          items={postures}
          onChange={(items) => upd({ postures: { ...viz.postures, postures: items } })}
        />
        <GesturePostureEditor
          label="Gestures"
          items={gestures}
          onChange={(items) => upd({ gestures: items })}
        />
      </div>
    </ItemCard>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export function VisualizationsSection() {
  const { asset, updateAsset } = useAssetStore();
  const visualizations = asset.visualizations ?? [];

  const add = () =>
    updateAsset({
      visualizations: [...visualizations, { size: 64, layerCount: 1, angle: 45, layers: [], colors: [], directions: [], animations: [] }],
    });

  const update = (i: number, v: IAssetVisualizationData) => {
    const next = [...visualizations]; next[i] = v;
    updateAsset({ visualizations: next });
  };

  const remove = (i: number) => updateAsset({ visualizations: visualizations.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      <SectionHeader
        title="Visualizations"
        description="Visual rendering configurations per size"
        count={visualizations.length}
        onAdd={add}
        addLabel="Add Visualization"
      />
      {visualizations.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
          No visualizations defined.
        </p>
      )}
      {visualizations.map((v, i) => (
        <VisualizationEntry key={i} viz={v} index={i} onChange={(val) => update(i, val)} onRemove={() => remove(i)} />
      ))}
    </div>
  );
}
