import type { IAssetRoomVisualizationData } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { DynamicForm } from '../schema/DynamicForm';
import { ROOM_VIZ_SCHEMA } from '../../schema/nitro.schema';

export function RoomVisualizationSection() {
  const { asset, updateAsset } = useAssetStore();
  const value = (asset.roomVisualization ?? {}) as Record<string, unknown>;

  return (
    <DynamicForm
      schema={ROOM_VIZ_SCHEMA}
      value={value}
      onChange={(v) => updateAsset({ roomVisualization: v as IAssetRoomVisualizationData })}
    />
  );
}
