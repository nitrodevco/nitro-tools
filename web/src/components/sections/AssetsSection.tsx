import type { IAsset } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { Field } from '../shared/Field';
import { FormRow } from '../shared/FormRow';
import { ItemCard } from '../shared/ItemCard';
import { SectionHeader } from '../shared/SectionHeader';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

function AssetEntry({
  asset,
  index,
  onChange,
  onRemove,
}: {
  asset: IAsset;
  index: number;
  onChange: (a: IAsset) => void;
  onRemove: () => void;
}) {
  const upd = (partial: Partial<IAsset>) => onChange({ ...asset, ...partial });
  return (
    <ItemCard title={asset.name ?? `Asset ${index}`} onRemove={onRemove} index={index}>
      <FormRow cols={2}>
        <Field label="Name">
          <Input value={asset.name ?? ''} onChange={(e) => upd({ name: e.target.value })} placeholder="asset_name" />
        </Field>
        <Field label="Source">
          <Input value={asset.source ?? ''} onChange={(e) => upd({ source: e.target.value })} placeholder="source_asset" />
        </Field>
      </FormRow>
      <FormRow cols={2}>
        <Field label="X Offset">
          <Input
            type="number"
            value={asset.x ?? 0}
            onChange={(e) => upd({ x: Number(e.target.value) })}
          />
        </Field>
        <Field label="Y Offset">
          <Input
            type="number"
            value={asset.y ?? 0}
            onChange={(e) => upd({ y: Number(e.target.value) })}
          />
        </Field>
      </FormRow>
      <div className="flex gap-6 pt-1">
        <div className="flex items-center gap-2">
          <Switch checked={asset.flipH ?? false} onCheckedChange={(v) => upd({ flipH: v })} />
          <Label className="text-xs">Flip H</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={asset.flipV ?? false} onCheckedChange={(v) => upd({ flipV: v })} />
          <Label className="text-xs">Flip V</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={asset.usesPalette ?? false} onCheckedChange={(v) => upd({ usesPalette: v })} />
          <Label className="text-xs">Uses Palette</Label>
        </div>
      </div>
    </ItemCard>
  );
}

export function AssetsSection() {
  const { asset, updateAsset } = useAssetStore();
  const assets = asset.assets ?? [];

  const add = () =>
    updateAsset({ assets: [...assets, { name: `asset_${assets.length}`, x: 0, y: 0 }] });

  const update = (i: number, a: IAsset) => {
    const next = [...assets];
    next[i] = a;
    updateAsset({ assets: next });
  };

  const remove = (i: number) => updateAsset({ assets: assets.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      <SectionHeader
        title="Assets"
        description="Individual sprite assets within this bundle"
        count={assets.length}
        onAdd={add}
        addLabel="Add Asset"
      />
      {assets.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
          No assets yet. Click "Add Asset" to get started.
        </p>
      )}
      {assets.map((a, i) => (
        <AssetEntry key={i} asset={a} index={i} onChange={(v) => update(i, v)} onRemove={() => remove(i)} />
      ))}
    </div>
  );
}
