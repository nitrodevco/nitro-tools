import type { IAsset } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { ArraySection } from '../schema/DynamicForm';
import { ASSET_SCHEMA } from '../../schema/nitro.schema';

export function AssetsSection() {
  const { asset, updateAsset } = useAssetStore();
  const items = (asset.assets ?? []) as Record<string, unknown>[];

  return (
    <ArraySection
      schema={ASSET_SCHEMA}
      items={items}
      labelKey="name"
      defaultItem={{ name: '', source: '', x: 0, y: 0, flipH: false, flipV: false, usesPalette: false }}
      addLabel="Add Asset"
      emptyText='No assets yet. Click "Add Asset" to get started.'
      onChange={(v) => updateAsset({ assets: v as IAsset[] })}
    />
  );
}
