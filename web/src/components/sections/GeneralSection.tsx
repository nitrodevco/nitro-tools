import type { IAssetData } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { DynamicForm } from '../schema/DynamicForm';
import { GENERAL_SCHEMA } from '../../schema/nitro.schema';

export function GeneralSection() {
  const { asset, updateAsset } = useAssetStore();
  return (
    <DynamicForm
      schema={GENERAL_SCHEMA}
      value={asset as Record<string, unknown>}
      onChange={(v) => updateAsset(v as Partial<IAssetData>)}
    />
  );
}
