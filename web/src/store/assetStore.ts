import { create } from 'zustand';
import type { IAssetData } from '../types/nitro';

interface AssetStore {
  asset: IAssetData;
  activeTab: string;
  setAsset: (asset: IAssetData) => void;
  updateAsset: (partial: Partial<IAssetData>) => void;
  setActiveTab: (tab: string) => void;
  resetAsset: () => void;
  loadAsset: (json: string) => { success: boolean; error?: string };
}

const defaultAsset: IAssetData = {
  type: 'furniture',
  name: 'my_asset',
  visualizationType: 'furniture',
  logicType: 'furniture',
  assets: [],
  aliases: [],
  animations: [],
  palettes: [],
  visualizations: [],
  logic: {
    model: {
      dimensions: { x: 1, y: 1, z: 115 },
      directions: [0, 2, 4, 6],
    },
  },
};

export const useAssetStore = create<AssetStore>((set) => ({
  asset: defaultAsset,
  activeTab: 'general',

  setAsset: (asset) => set({ asset }),

  updateAsset: (partial) =>
    set((state) => ({ asset: { ...state.asset, ...partial } })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  resetAsset: () => set({ asset: { ...defaultAsset } }),

  loadAsset: (json) => {
    try {
      const parsed = JSON.parse(json) as IAssetData;
      set({ asset: parsed });
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  },
}));
