import type { IAssetAlias } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { ArraySection } from '../schema/DynamicForm';
import { ALIAS_SCHEMA } from '../../schema/nitro.schema';

export function AliasesSection() {
  const { asset, updateAsset } = useAssetStore();
  const items = (asset.aliases ?? []) as Record<string, unknown>[];

  return (
    <ArraySection
      schema={ALIAS_SCHEMA}
      items={items}
      labelKey="name"
      defaultItem={{ name: '', link: '', flipH: false, flipV: false }}
      addLabel="Add Alias"
      emptyText='No aliases yet. Click "Add Alias" to create one.'
      onChange={(v) => updateAsset({ aliases: v as IAssetAlias[] })}
    />
  );
}
