import type { IAssetAlias } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { Field } from '../shared/Field';
import { FormRow } from '../shared/FormRow';
import { ItemCard } from '../shared/ItemCard';
import { SectionHeader } from '../shared/SectionHeader';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

function AliasEntry({
  alias,
  index,
  onChange,
  onRemove,
}: {
  alias: IAssetAlias;
  index: number;
  onChange: (a: IAssetAlias) => void;
  onRemove: () => void;
}) {
  const upd = (partial: Partial<IAssetAlias>) => onChange({ ...alias, ...partial });
  return (
    <ItemCard title={alias.name ?? `Alias ${index}`} subtitle={alias.link ? `→ ${alias.link}` : undefined} onRemove={onRemove} index={index}>
      <FormRow cols={2}>
        <Field label="Name" hint="The alias identifier">
          <Input value={alias.name ?? ''} onChange={(e) => upd({ name: e.target.value })} placeholder="alias_name" />
        </Field>
        <Field label="Link" hint="Points to the source asset name">
          <Input value={alias.link ?? ''} onChange={(e) => upd({ link: e.target.value })} placeholder="source_asset" />
        </Field>
      </FormRow>
      <div className="flex gap-6 pt-1">
        <div className="flex items-center gap-2">
          <Switch checked={alias.flipH ?? false} onCheckedChange={(v) => upd({ flipH: v })} />
          <Label className="text-xs">Flip H</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={alias.flipV ?? false} onCheckedChange={(v) => upd({ flipV: v })} />
          <Label className="text-xs">Flip V</Label>
        </div>
      </div>
    </ItemCard>
  );
}

export function AliasesSection() {
  const { asset, updateAsset } = useAssetStore();
  const aliases = asset.aliases ?? [];

  const add = () => updateAsset({ aliases: [...aliases, { name: `alias_${aliases.length}`, link: '' }] });
  const update = (i: number, a: IAssetAlias) => {
    const next = [...aliases];
    next[i] = a;
    updateAsset({ aliases: next });
  };
  const remove = (i: number) => updateAsset({ aliases: aliases.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      <SectionHeader
        title="Aliases"
        description="Asset name aliases with optional flipping"
        count={aliases.length}
        onAdd={add}
        addLabel="Add Alias"
      />
      {aliases.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
          No aliases yet. Click "Add Alias" to create one.
        </p>
      )}
      {aliases.map((a, i) => (
        <AliasEntry key={i} alias={a} index={i} onChange={(v) => update(i, v)} onRemove={() => remove(i)} />
      ))}
    </div>
  );
}
