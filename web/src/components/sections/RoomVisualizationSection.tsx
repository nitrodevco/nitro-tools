import { X } from 'lucide-react';
import type {
  IAssetPlane,
  IAssetPlaneMask,
  IAssetPlaneMaterial,
  IAssetPlaneMaterialCell,
  IAssetPlaneTexture,
  IAssetPlaneVisualization,
  IAssetPlaneVisualizationData,
  IAssetPlaneVisualizationLayer,
  IAssetRoomVisualizationData,
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

// ── Texture editor ────────────────────────────────────────────────────────────

function TextureEditor({ tex, onChange, onRemove }: { tex: IAssetPlaneTexture; onChange: (t: IAssetPlaneTexture) => void; onRemove: () => void }) {
  const upd = (p: Partial<IAssetPlaneTexture>) => onChange({ ...tex, ...p });
  const bitmaps = tex.bitmaps ?? [];
  return (
    <div className="p-2 bg-muted/20 rounded border border-border/40 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Texture: {tex.id}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      <Field label="ID"><Input value={tex.id ?? ''} onChange={(e) => upd({ id: e.target.value })} className="h-7 text-xs" /></Field>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground/70">Bitmaps</Label>
          <Button size="sm" variant="outline" className="h-5 text-xs" onClick={() => upd({ bitmaps: [...bitmaps, { assetName: '' }] })}>+ Bitmap</Button>
        </div>
        {bitmaps.map((b, bi) => (
          <div key={bi} className="flex gap-2 items-center">
            <Input value={b.assetName ?? ''} onChange={(e) => { const n=[...bitmaps];n[bi]={...b,assetName:e.target.value};upd({bitmaps:n}); }} className="h-6 text-xs flex-1" placeholder="assetName" />
            <Input type="number" value={b.x ?? 0} onChange={(e) => { const n=[...bitmaps];n[bi]={...b,x:Number(e.target.value)};upd({bitmaps:n}); }} className="h-6 text-xs w-14" placeholder="x" />
            <Input type="number" value={b.y ?? 0} onChange={(e) => { const n=[...bitmaps];n[bi]={...b,y:Number(e.target.value)};upd({bitmaps:n}); }} className="h-6 text-xs w-14" placeholder="y" />
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => upd({ bitmaps: bitmaps.filter((_,i)=>i!==bi) })}><X className="h-2.5 w-2.5" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Material editor ───────────────────────────────────────────────────────────

function MaterialEditor({ mat, onChange, onRemove }: { mat: IAssetPlaneMaterial; onChange: (m: IAssetPlaneMaterial) => void; onRemove: () => void }) {
  const upd = (p: Partial<IAssetPlaneMaterial>) => onChange({ ...mat, ...p });
  const matrices = mat.matrices ?? [];
  return (
    <div className="p-2 bg-muted/20 rounded border border-border/40 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Material: {mat.id}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      <Field label="ID"><Input value={mat.id ?? ''} onChange={(e) => upd({ id: e.target.value })} className="h-7 text-xs" /></Field>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground/70">Cell Matrices</Label>
          <Button size="sm" variant="outline" className="h-5 text-xs" onClick={() => upd({ matrices: [...matrices, { columns: [] }] })}>+ Matrix</Button>
        </div>
        {matrices.map((mx, mxi) => {
          const cols = mx.columns ?? [];
          return (
            <div key={mxi} className="p-1.5 bg-muted/20 rounded border border-border/20 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground/60">Matrix {mxi}</span>
                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => upd({ matrices: matrices.filter((_,i)=>i!==mxi) })}><X className="h-2 w-2"/></Button>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground/50">Columns</Label>
                <Button size="sm" variant="outline" className="h-4 text-xs" onClick={() => { const n=[...matrices];n[mxi]={...mx,columns:[...cols,{cells:[]}]};upd({matrices:n}); }}>+ Col</Button>
              </div>
              {cols.map((col, ci) => {
                const cells: IAssetPlaneMaterialCell[] = col.cells ?? [];
                return (
                  <div key={ci} className="p-1 bg-muted/20 rounded border border-border/10 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground/50">Col {ci}</span>
                      <Button variant="ghost" size="icon" className="h-3 w-3" onClick={() => { const n=[...matrices];n[mxi]={...mx,columns:cols.filter((_,i)=>i!==ci)};upd({matrices:n}); }}><X className="h-1.5 w-1.5"/></Button>
                    </div>
                    {cells.map((cell, celli) => (
                      <div key={celli} className="flex gap-1 items-center">
                        <Input value={cell.textureId ?? ''} onChange={(e) => { const nm=[...matrices];const nc=[...cols];const nce=[...cells];nce[celli]={...cell,textureId:e.target.value};nc[ci]={...col,cells:nce};nm[mxi]={...mx,columns:nc};upd({matrices:nm}); }} className="h-4 text-xs flex-1" placeholder="textureId" />
                        <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => { const nm=[...matrices];const nc=[...cols];nc[ci]={...col,cells:cells.filter((_,i)=>i!==celli)};nm[mxi]={...mx,columns:nc};upd({matrices:nm}); }}><X className="h-2 w-2"/></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" className="h-4 text-xs w-full" onClick={() => { const nm=[...matrices];const nc=[...cols];nc[ci]={...col,cells:[...cells,{textureId:''}]};nm[mxi]={...mx,columns:nc};upd({matrices:nm}); }}>+ Cell</Button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Plane visualization editor ─────────────────────────────────────────────────

function PlaneVisualizationEditor({ pv, onChange, onRemove }: { pv: IAssetPlaneVisualization; onChange: (p: IAssetPlaneVisualization) => void; onRemove: () => void }) {
  const upd = (p: Partial<IAssetPlaneVisualization>) => onChange({ ...pv, ...p });
  const layers: IAssetPlaneVisualizationLayer[] = pv.layers ?? [];
  return (
    <div className="p-2 bg-muted/20 rounded border border-border/30 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Viz {pv.id ?? '?'} (size={pv.size ?? '?'})</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      <FormRow cols={2}>
        <Field label="ID"><Input type="number" value={pv.id ?? 0} onChange={(e) => upd({ id: Number(e.target.value) })} className="h-7 text-xs" /></Field>
        <Field label="Size"><Input type="number" value={pv.size ?? 64} onChange={(e) => upd({ size: Number(e.target.value) })} className="h-7 text-xs" /></Field>
      </FormRow>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground">Layers</Label>
          <Button size="sm" variant="outline" className="h-5 text-xs" onClick={() => upd({ layers: [...layers, {}] })}>+ Layer</Button>
        </div>
        {layers.map((l, li) => (
          <div key={li} className="flex gap-2 items-center p-1.5 bg-muted/20 rounded border border-border/20">
            <Input value={l.materialId ?? ''} onChange={(e) => { const n=[...layers];n[li]={...l,materialId:e.target.value};upd({layers:n}); }} className="h-5 text-xs flex-1" placeholder="materialId" />
            <Input type="number" value={l.x ?? 0} onChange={(e) => { const n=[...layers];n[li]={...l,x:Number(e.target.value)};upd({layers:n}); }} className="h-5 text-xs w-12" placeholder="x" />
            <Input type="number" value={l.y ?? 0} onChange={(e) => { const n=[...layers];n[li]={...l,y:Number(e.target.value)};upd({layers:n}); }} className="h-5 text-xs w-12" placeholder="y" />
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => upd({ layers: layers.filter((_,i)=>i!==li) })}><X className="h-2.5 w-2.5"/></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Plane editor ──────────────────────────────────────────────────────────────

function PlaneEditor({ plane, onChange, onRemove }: { plane: IAssetPlane; onChange: (p: IAssetPlane) => void; onRemove: () => void }) {
  const upd = (p: Partial<IAssetPlane>) => onChange({ ...plane, ...p });
  const vizs = plane.visualizations ?? [];
  return (
    <div className="p-2 bg-muted/20 rounded border border-border/40 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Plane: {plane.id}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}><X className="h-3 w-3" /></Button>
      </div>
      <Field label="ID"><Input value={plane.id ?? ''} onChange={(e) => upd({ id: e.target.value })} className="h-7 text-xs" /></Field>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground">Visualizations</Label>
          <Button size="sm" variant="outline" className="h-5 text-xs" onClick={() => upd({ visualizations: [...vizs, { id: vizs.length, size: 64, layers: [] }] })}>+ Viz</Button>
        </div>
        {vizs.map((v, vi) => (
          <PlaneVisualizationEditor key={vi} pv={v} onChange={(val) => { const n=[...vizs];n[vi]=val;upd({visualizations:n}); }} onRemove={() => upd({ visualizations: vizs.filter((_,i)=>i!==vi) })} />
        ))}
      </div>
    </div>
  );
}

// ── Plane data editor ─────────────────────────────────────────────────────────

function PlaneDataEditor({ title, data, onChange }: { title: string; data?: IAssetPlaneVisualizationData; onChange: (d: IAssetPlaneVisualizationData) => void }) {
  const d: IAssetPlaneVisualizationData = data ?? {};
  const upd = (p: Partial<IAssetPlaneVisualizationData>) => onChange({ ...d, ...p });
  const textures = d.textures ?? [];
  const materials = d.materials ?? [];
  const planes = d.planes ?? [];

  return (
    <ItemCard title={title} defaultOpen={false}>
      {/* Textures */}
      <div className="space-y-2">
        <SectionHeader title="Textures" count={textures.length} onAdd={() => upd({ textures: [...textures, { id: `tex_${textures.length}`, bitmaps: [] }] })} addLabel="Add Texture" />
        {textures.map((t, ti) => (
          <TextureEditor key={ti} tex={t} onChange={(v) => { const n=[...textures];n[ti]=v;upd({textures:n}); }} onRemove={() => upd({ textures: textures.filter((_,i)=>i!==ti) })} />
        ))}
      </div>
      <Separator />
      {/* Materials */}
      <div className="space-y-2">
        <SectionHeader title="Materials" count={materials.length} onAdd={() => upd({ materials: [...materials, { id: `mat_${materials.length}`, matrices: [] }] })} addLabel="Add Material" />
        {materials.map((m, mi) => (
          <MaterialEditor key={mi} mat={m} onChange={(v) => { const n=[...materials];n[mi]=v;upd({materials:n}); }} onRemove={() => upd({ materials: materials.filter((_,i)=>i!==mi) })} />
        ))}
      </div>
      <Separator />
      {/* Planes */}
      <div className="space-y-2">
        <SectionHeader title="Planes" count={planes.length} onAdd={() => upd({ planes: [...planes, { id: `plane_${planes.length}`, visualizations: [] }] })} addLabel="Add Plane" />
        {planes.map((p, pi) => (
          <PlaneEditor key={pi} plane={p} onChange={(v) => { const n=[...planes];n[pi]=v;upd({planes:n}); }} onRemove={() => upd({ planes: planes.filter((_,i)=>i!==pi) })} />
        ))}
      </div>
    </ItemCard>
  );
}

// ── Mask section ──────────────────────────────────────────────────────────────

function MasksEditor({ masks, onChange }: { masks: IAssetPlaneMask[]; onChange: (m: IAssetPlaneMask[]) => void }) {
  return (
    <div className="space-y-2">
      <SectionHeader title="Masks" count={masks.length} onAdd={() => onChange([...masks, { id: `mask_${masks.length}`, visualizations: [] }])} addLabel="Add Mask" />
      {masks.map((mask, mi) => {
        const vizs = mask.visualizations ?? [];
        return (
          <div key={mi} className="p-2 bg-muted/20 rounded border border-border/40 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Mask: {mask.id}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onChange(masks.filter((_,i)=>i!==mi))}><X className="h-3 w-3"/></Button>
            </div>
            <Field label="ID"><Input value={mask.id ?? ''} onChange={(e) => { const n=[...masks];n[mi]={...mask,id:e.target.value};onChange(n); }} className="h-7 text-xs" /></Field>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground/70">Visualizations</Label>
                <Button size="sm" variant="outline" className="h-5 text-xs" onClick={() => { const n=[...masks];n[mi]={...mask,visualizations:[...vizs,{id:vizs.length,size:64}]};onChange(n); }}>+ Viz</Button>
              </div>
              {vizs.map((v, vi) => (
                <div key={vi} className="flex gap-2 items-center">
                  <Input type="number" value={v.id ?? vi} onChange={(e) => { const n=[...masks];const nv=[...vizs];nv[vi]={...v,id:Number(e.target.value)};n[mi]={...mask,visualizations:nv};onChange(n); }} className="h-6 text-xs w-14" placeholder="id" />
                  <Input type="number" value={v.size ?? 64} onChange={(e) => { const n=[...masks];const nv=[...vizs];nv[vi]={...v,size:Number(e.target.value)};n[mi]={...mask,visualizations:nv};onChange(n); }} className="h-6 text-xs w-14" placeholder="size" />
                  <Input value={v.assetName ?? ''} onChange={(e) => { const n=[...masks];const nv=[...vizs];nv[vi]={...v,assetName:e.target.value};n[mi]={...mask,visualizations:nv};onChange(n); }} className="h-6 text-xs flex-1" placeholder="assetName" />
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { const n=[...masks];n[mi]={...mask,visualizations:vizs.filter((_,i)=>i!==vi)};onChange(n); }}><X className="h-2.5 w-2.5"/></Button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export function RoomVisualizationSection() {
  const { asset, updateAsset } = useAssetStore();
  const rv: IAssetRoomVisualizationData = asset.roomVisualization ?? {};
  const upd = (p: Partial<IAssetRoomVisualizationData>) => updateAsset({ roomVisualization: { ...rv, ...p } });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Configure floor, wall, and landscape visual data for room assets.</p>

      <PlaneDataEditor title="Floor Data" data={rv.floorData} onChange={(d) => upd({ floorData: d })} />
      <PlaneDataEditor title="Wall Data" data={rv.wallData} onChange={(d) => upd({ wallData: d })} />
      <PlaneDataEditor title="Landscape Data" data={rv.landscapeData} onChange={(d) => upd({ landscapeData: d })} />

      <ItemCard title="Mask Data" defaultOpen={false}>
        <MasksEditor
          masks={rv.maskData?.masks ?? []}
          onChange={(masks) => upd({ maskData: { masks } })}
        />
      </ItemCard>
    </div>
  );
}
