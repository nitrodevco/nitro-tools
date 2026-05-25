import { X } from 'lucide-react';
import type {
  IAssetAnimation,
  IAssetAnimationFrame,
  IAssetAnimationFramePart,
  IAssetAnimationSprite,
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

// ── Sprite editor ─────────────────────────────────────────────────────────────

function SpriteEditor({
  sprite,
  index,
  onChange,
  onRemove,
}: {
  sprite: IAssetAnimationSprite;
  index: number;
  onChange: (s: IAssetAnimationSprite) => void;
  onRemove: () => void;
}) {
  const upd = (p: Partial<IAssetAnimationSprite>) => onChange({ ...sprite, ...p });
  const dirs = sprite.directionList ?? [];
  return (
    <div className="p-2 bg-muted/20 rounded border border-border/40 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Sprite {sprite.id ?? index}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      <FormRow cols={2}>
        <Field label="ID"><Input value={sprite.id ?? ''} onChange={(e) => upd({ id: e.target.value })} className="h-7 text-xs" /></Field>
        <Field label="Member"><Input value={sprite.member ?? ''} onChange={(e) => upd({ member: e.target.value })} className="h-7 text-xs" /></Field>
      </FormRow>
      <FormRow cols={3}>
        <Field label="Directions"><Input type="number" value={sprite.directions ?? 0} onChange={(e) => upd({ directions: Number(e.target.value) })} className="h-7 text-xs" /></Field>
        <Field label="Static Y"><Input type="number" value={sprite.staticY ?? 0} onChange={(e) => upd({ staticY: Number(e.target.value) })} className="h-7 text-xs" /></Field>
        <Field label="Ink"><Input type="number" value={sprite.ink ?? 0} onChange={(e) => upd({ ink: Number(e.target.value) })} className="h-7 text-xs" /></Field>
      </FormRow>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground">Direction Offsets</Label>
          <Button size="sm" variant="outline" className="h-5 text-xs" onClick={() => upd({ directionList: [...dirs, { dx: 0, dy: 0 }] })}>+ Dir</Button>
        </div>
        {dirs.map((d, di) => (
          <div key={di} className="flex gap-2 items-center">
            <Input type="number" value={d.dx ?? 0} onChange={(e) => { const n=[...dirs];n[di]={...d,dx:Number(e.target.value)};upd({directionList:n}); }} className="h-5 text-xs flex-1" placeholder="dx" />
            <Input type="number" value={d.dy ?? 0} onChange={(e) => { const n=[...dirs];n[di]={...d,dy:Number(e.target.value)};upd({directionList:n}); }} className="h-5 text-xs flex-1" placeholder="dy" />
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => upd({ directionList: dirs.filter((_,i)=>i!==di) })}><X className="h-2.5 w-2.5" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Frame part editor ─────────────────────────────────────────────────────────

function FramePartEditor({
  part,
  onChange,
  onRemove,
}: {
  part: IAssetAnimationFramePart;
  onChange: (p: IAssetAnimationFramePart) => void;
  onRemove: () => void;
}) {
  const upd = (patch: Partial<IAssetAnimationFramePart>) => onChange({ ...part, ...patch });
  const items = part.items ?? [];
  return (
    <div className="p-2 bg-muted/20 rounded border border-border/30 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Part: {part.id ?? '?'}</span>
        <Button variant="ghost" size="icon" className="h-4 w-4" onClick={onRemove}><X className="h-2.5 w-2.5" /></Button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        <Field label="ID"><Input value={part.id??''} onChange={e=>upd({id:e.target.value})} className="h-5 text-xs" /></Field>
        <Field label="Frame"><Input type="number" value={part.frame??0} onChange={e=>upd({frame:Number(e.target.value)})} className="h-5 text-xs" /></Field>
        <Field label="Base"><Input value={part.base??''} onChange={e=>upd({base:e.target.value})} className="h-5 text-xs" /></Field>
        <Field label="dx"><Input type="number" value={part.dx??0} onChange={e=>upd({dx:Number(e.target.value)})} className="h-5 text-xs" /></Field>
        <Field label="dy"><Input type="number" value={part.dy??0} onChange={e=>upd({dy:Number(e.target.value)})} className="h-5 text-xs" /></Field>
        <Field label="dz"><Input type="number" value={part.dz??0} onChange={e=>upd({dz:Number(e.target.value)})} className="h-5 text-xs" /></Field>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground/70">Items</Label>
          <Button size="sm" variant="outline" className="h-4 text-xs" onClick={()=>upd({items:[...items,{id:'',base:''}]})}>+</Button>
        </div>
        {items.map((item,ii)=>(
          <div key={ii} className="flex gap-1 items-center">
            <Input value={item.id??''} onChange={e=>{const n=[...items];n[ii]={...item,id:e.target.value};upd({items:n});}} className="h-4 text-xs flex-1" placeholder="id" />
            <Input value={item.base??''} onChange={e=>{const n=[...items];n[ii]={...item,base:e.target.value};upd({items:n});}} className="h-4 text-xs flex-1" placeholder="base" />
            <Button variant="ghost" size="icon" className="h-4 w-4" onClick={()=>upd({items:items.filter((_,i)=>i!==ii)})}><X className="h-2 w-2"/></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Frame editor ──────────────────────────────────────────────────────────────

function FrameEditor({
  frame,
  index,
  onChange,
  onRemove,
}: {
  frame: IAssetAnimationFrame;
  index: number;
  onChange: (f: IAssetAnimationFrame) => void;
  onRemove: () => void;
}) {
  const upd = (p: Partial<IAssetAnimationFrame>) => onChange({ ...frame, ...p });
  const bodyparts = frame.bodyparts ?? [];
  const fxs = frame.fxs ?? [];
  return (
    <div className="p-2 bg-muted/20 rounded border border-border/40 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Frame {index}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      <Field label="Repeats"><Input type="number" value={frame.repeats??1} onChange={(e)=>upd({repeats:Number(e.target.value)})} className="h-7 text-xs" /></Field>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground">Body Parts</Label>
          <Button size="sm" variant="outline" className="h-5 text-xs" onClick={()=>upd({bodyparts:[...bodyparts,{id:'',frame:0}]})}>+</Button>
        </div>
        {bodyparts.map((bp,bpi)=>(
          <FramePartEditor key={bpi} part={bp} onChange={(v)=>{const n=[...bodyparts];n[bpi]=v;upd({bodyparts:n});}} onRemove={()=>upd({bodyparts:bodyparts.filter((_,i)=>i!==bpi)})} />
        ))}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground">FX Parts</Label>
          <Button size="sm" variant="outline" className="h-5 text-xs" onClick={()=>upd({fxs:[...fxs,{id:'',frame:0}]})}>+</Button>
        </div>
        {fxs.map((fx,fxi)=>(
          <FramePartEditor key={fxi} part={fx} onChange={(v)=>{const n=[...fxs];n[fxi]=v;upd({fxs:n});}} onRemove={()=>upd({fxs:fxs.filter((_,i)=>i!==fxi)})} />
        ))}
      </div>
    </div>
  );
}

// ── Animation entry ───────────────────────────────────────────────────────────

function AnimationEntry({
  anim,
  index,
  onChange,
  onRemove,
}: {
  anim: IAssetAnimation;
  index: number;
  onChange: (a: IAssetAnimation) => void;
  onRemove: () => void;
}) {
  const upd = (p: Partial<IAssetAnimation>) => onChange({ ...anim, ...p });
  const sprites = anim.sprites ?? [];
  const frames = anim.frames ?? [];
  const dirs = anim.directions ?? [];

  return (
    <ItemCard title={anim.name ?? `Animation ${index}`} subtitle={anim.desc} onRemove={onRemove} index={index}>
      <FormRow cols={2}>
        <Field label="Name">
          <Input value={anim.name ?? ''} onChange={(e) => upd({ name: e.target.value })} placeholder="anim_name" />
        </Field>
        <Field label="Description">
          <Input value={anim.desc ?? ''} onChange={(e) => upd({ desc: e.target.value })} placeholder="desc" />
        </Field>
      </FormRow>
      <div className="flex items-center gap-2">
        <Switch checked={anim.resetOnToggle ?? false} onCheckedChange={(v) => upd({ resetOnToggle: v })} />
        <Label className="text-xs">Reset On Toggle</Label>
      </div>

      <Separator />

      {/* Directions */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Directions</Label>
          <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => upd({ directions: [...dirs, { offset: 0 }] })}>Add Dir</Button>
        </div>
        {dirs.map((d, di) => (
          <div key={di} className="flex gap-2 items-center">
            <Input type="number" value={d.offset ?? 0} onChange={(e) => { const n=[...dirs];n[di]={offset:Number(e.target.value)};upd({directions:n}); }} className="h-7 text-xs flex-1" placeholder="offset" />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => upd({ directions: dirs.filter((_,i)=>i!==di) })}><X className="h-3 w-3" /></Button>
          </div>
        ))}
      </div>

      <Separator />

      {/* Sprites */}
      <div className="space-y-2">
        <SectionHeader title="Sprites" count={sprites.length} onAdd={() => upd({ sprites: [...sprites, { id: String(sprites.length) }] })} addLabel="Add Sprite" />
        {sprites.map((s, si) => (
          <SpriteEditor key={si} sprite={s} index={si} onChange={(v) => { const n=[...sprites];n[si]=v;upd({sprites:n}); }} onRemove={() => upd({ sprites: sprites.filter((_,i)=>i!==si) })} />
        ))}
      </div>

      <Separator />

      {/* Frames */}
      <div className="space-y-2">
        <SectionHeader title="Frames" count={frames.length} onAdd={() => upd({ frames: [...frames, { repeats: 1 }] })} addLabel="Add Frame" />
        {frames.map((f, fi) => (
          <FrameEditor key={fi} frame={f} index={fi} onChange={(v) => { const n=[...frames];n[fi]=v;upd({frames:n}); }} onRemove={() => upd({ frames: frames.filter((_,i)=>i!==fi) })} />
        ))}
      </div>
    </ItemCard>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export function AnimationsSection() {
  const { asset, updateAsset } = useAssetStore();
  const animations = asset.animations ?? [];

  const add = () =>
    updateAsset({ animations: [...animations, { name: `animation_${animations.length}`, sprites: [], frames: [] }] });

  const update = (i: number, a: IAssetAnimation) => {
    const next = [...animations]; next[i] = a;
    updateAsset({ animations: next });
  };

  const remove = (i: number) => updateAsset({ animations: animations.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      <SectionHeader
        title="Animations"
        description="Asset-level animation definitions"
        count={animations.length}
        onAdd={add}
        addLabel="Add Animation"
      />
      {animations.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
          No animations defined.
        </p>
      )}
      {animations.map((a, i) => (
        <AnimationEntry key={i} anim={a} index={i} onChange={(v) => update(i, v)} onRemove={() => remove(i)} />
      ))}
    </div>
  );
}
