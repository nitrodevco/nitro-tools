import { X } from 'lucide-react';
import type { IAssetPalette } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { Field } from '../shared/Field';
import { FormRow } from '../shared/FormRow';
import { ItemCard } from '../shared/ItemCard';
import { SectionHeader } from '../shared/SectionHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

function RgbRow({
  value,
  onChange,
  onRemove,
}: {
  value: [number, number, number];
  onChange: (v: [number, number, number]) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      {(['R', 'G', 'B'] as const).map((ch, ci) => (
        <div key={ch} className="flex items-center gap-1 flex-1">
          <span className="text-xs text-muted-foreground w-3">{ch}</span>
          <Input
            type="number"
            min={0}
            max={255}
            value={value[ci]}
            onChange={(e) => {
              const next: [number, number, number] = [...value] as [number, number, number];
              next[ci] = Number(e.target.value);
              onChange(next);
            }}
            className="h-7 text-xs"
          />
        </div>
      ))}
      <div
        className="w-6 h-6 rounded border border-border shrink-0"
        style={{ backgroundColor: `rgb(${value[0]},${value[1]},${value[2]})` }}
      />
      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onRemove}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

function PaletteEntry({
  palette,
  index,
  onChange,
  onRemove,
}: {
  palette: IAssetPalette;
  index: number;
  onChange: (p: IAssetPalette) => void;
  onRemove: () => void;
}) {
  const upd = (partial: Partial<IAssetPalette>) => onChange({ ...palette, ...partial });
  const rgb = palette.rgb ?? [];

  return (
    <ItemCard title={`Palette ${palette.id ?? index}`} onRemove={onRemove} index={index}>
      <FormRow cols={3}>
        <Field label="ID">
          <Input type="number" value={palette.id ?? 0} onChange={(e) => upd({ id: Number(e.target.value) })} />
        </Field>
        <Field label="Source">
          <Input value={palette.source ?? ''} onChange={(e) => upd({ source: e.target.value })} placeholder="source" />
        </Field>
        <Field label="Breed">
          <Input type="number" value={palette.breed ?? 0} onChange={(e) => upd({ breed: Number(e.target.value) })} />
        </Field>
      </FormRow>
      <FormRow cols={2}>
        <Field label="Color 1 (hex)">
          <Input value={palette.color1 ?? ''} onChange={(e) => upd({ color1: e.target.value })} placeholder="#FFFFFF" />
        </Field>
        <Field label="Color 2 (hex)">
          <Input value={palette.color2 ?? ''} onChange={(e) => upd({ color2: e.target.value })} placeholder="#000000" />
        </Field>
      </FormRow>
      <FormRow cols={2}>
        <Field label="Color Tag">
          <Input type="number" value={palette.colorTag ?? 0} onChange={(e) => upd({ colorTag: Number(e.target.value) })} />
        </Field>
        <Field label="Tags (comma-separated)">
          <Input
            value={(palette.tags ?? []).join(',')}
            onChange={(e) => upd({ tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            placeholder="tag1,tag2"
          />
        </Field>
      </FormRow>
      <div className="flex items-center gap-2">
        <Switch checked={palette.master ?? false} onCheckedChange={(v) => upd({ master: v })} />
        <Label className="text-xs">Master palette</Label>
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">RGB Colors</Label>
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs"
            onClick={() => upd({ rgb: [...rgb, [255, 255, 255]] })}
          >
            Add RGB
          </Button>
        </div>
        {rgb.map((row, ri) => (
          <RgbRow
            key={ri}
            value={row}
            onChange={(v) => {
              const next = [...rgb];
              next[ri] = v;
              upd({ rgb: next });
            }}
            onRemove={() => upd({ rgb: rgb.filter((_, idx) => idx !== ri) })}
          />
        ))}
      </div>
    </ItemCard>
  );
}

export function PalettesSection() {
  const { asset, updateAsset } = useAssetStore();
  const palettes = asset.palettes ?? [];

  const add = () =>
    updateAsset({ palettes: [...palettes, { id: palettes.length, source: '', rgb: [] }] });

  const update = (i: number, p: IAssetPalette) => {
    const next = [...palettes];
    next[i] = p;
    updateAsset({ palettes: next });
  };

  const remove = (i: number) => updateAsset({ palettes: palettes.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      <SectionHeader
        title="Palettes"
        description="Color palettes for asset colorization"
        count={palettes.length}
        onAdd={add}
        addLabel="Add Palette"
      />
      {palettes.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
          No palettes defined.
        </p>
      )}
      {palettes.map((p, i) => (
        <PaletteEntry key={i} palette={p} index={i} onChange={(v) => update(i, v)} onRemove={() => remove(i)} />
      ))}
    </div>
  );
}
