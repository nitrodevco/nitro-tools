import type { IAssetAnimation } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { ArraySection } from '../schema/DynamicForm';
import { ANIMATION_SCHEMA } from '../../schema/nitro.schema';

export function AnimationsSection() {
  const { asset, updateAsset } = useAssetStore();
  const items = (asset.animations ?? []) as Record<string, unknown>[];

  return (
    <ArraySection
      schema={ANIMATION_SCHEMA}
      items={items}
      labelKey="name"
      defaultItem={{ name: '', desc: '', resetOnToggle: false, directions: [], sprites: [], frames: [] }}
      addLabel="Add Animation"
      emptyText="No animations defined."
      onChange={(v) => updateAsset({ animations: v as IAssetAnimation[] })}
    />
  );
}
