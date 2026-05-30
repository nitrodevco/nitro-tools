import type { IAssetLogicData } from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { DynamicForm } from '../schema/DynamicForm';
import { LOGIC_SCHEMA } from '../../schema/nitro.schema';

export function LogicSection() {
  const { asset, updateAsset } = useAssetStore();
  const value = (asset.logic ?? {}) as Record<string, unknown>;

  return (
    <DynamicForm
      schema={LOGIC_SCHEMA}
      value={value}
      onChange={(v) => updateAsset({ logic: v as IAssetLogicData })}
    />
  );
}
