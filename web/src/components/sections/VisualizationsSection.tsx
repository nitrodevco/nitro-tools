import type { IAssetVisualizationData } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { ArraySection } from '../schema/DynamicForm';
import { VISUALIZATION_SCHEMA } from '../../schema/nitro.schema';

export function VisualizationsSection() {
  const { asset, updateAsset } = useAssetStore();
  const items = (asset.visualizations ?? []) as Record<string, unknown>[];

  return (
    <ArraySection
      schema={VISUALIZATION_SCHEMA}
      items={items}
      labelKey="size"
      defaultItem={{ size: 64, layerCount: 1, angle: 45, layers: [], colors: [], directions: [], animations: [], gestures: [] }}
      addLabel="Add Visualization"
      emptyText="No visualizations defined."
      onChange={(v) => updateAsset({ visualizations: v as IAssetVisualizationData[] })}
    />
  );
}
