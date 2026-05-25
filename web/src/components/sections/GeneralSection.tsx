import { useAssetStore } from '../../store/assetStore';
import { Field } from '../shared/Field';
import { FormRow } from '../shared/FormRow';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ASSET_TYPES = ['furniture', 'figure', 'effect', 'pet', 'badge', 'room'];
const VIZ_TYPES = ['furniture', 'figure', 'avatar', 'room', 'none'];
const LOGIC_TYPES = ['furniture', 'figure', 'avatar', 'room', 'none'];

export function GeneralSection() {
  const { asset, updateAsset } = useAssetStore();

  return (
    <div className="space-y-4">
      <FormRow cols={2}>
        <Field label="Name" hint="Unique identifier for this asset">
          <Input
            value={asset.name ?? ''}
            onChange={(e) => updateAsset({ name: e.target.value })}
            placeholder="my_asset"
          />
        </Field>
        <Field label="Type" hint="Asset category type">
          <Select value={asset.type ?? ''} onValueChange={(v) => updateAsset({ type: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {ASSET_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FormRow>

      <FormRow cols={2}>
        <Field label="Visualization Type" hint="How this asset is rendered visually">
          <Select value={asset.visualizationType ?? ''} onValueChange={(v) => updateAsset({ visualizationType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select viz type" />
            </SelectTrigger>
            <SelectContent>
              {VIZ_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Logic Type" hint="Logic handler for this asset">
          <Select value={asset.logicType ?? ''} onValueChange={(v) => updateAsset({ logicType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select logic type" />
            </SelectTrigger>
            <SelectContent>
              {LOGIC_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FormRow>
    </div>
  );
}
