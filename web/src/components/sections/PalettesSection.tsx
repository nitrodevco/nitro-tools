import type { IAssetPalette } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { ArraySection } from '../schema/DynamicForm';
import { PALETTE_SCHEMA } from '../../schema/nitro.schema';

export function PalettesSection() {
  const { asset, updateAsset } = useAssetStore();
  const items = (asset.palettes ?? []) as Record<string, unknown>[];

  return (
    <ArraySection
      schema={PALETTE_SCHEMA}
      items={items}
      labelKey="id"
      defaultItem={{ id: 0, source: '', breed: 0, colorTag: 0, color1: '', color2: '', tags: [], master: false, rgb: [] }}
      addLabel="Add Palette"
      emptyText="No palettes defined."
      onChange={(v) => updateAsset({ palettes: v as IAssetPalette[] })}
    />
  );
}
