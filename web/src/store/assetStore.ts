import { create } from 'zustand';
import type { IAssetData, ISpritesheetData, ISpritesheetFrame, ISpritesheetMeta } from '../types/nitro';
import { packImages, readImageFile, type PackResult } from '../utils/packer';

export interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

interface AssetStore {
  asset: IAssetData;
  activeTab: string;

  // Image management
  images: UploadedImage[];
  packedSheetUrl: string | null;
  selectedFrameName: string | null;
  isRepacking: boolean;

  // Asset actions
  setAsset: (asset: IAssetData) => void;
  updateAsset: (partial: Partial<IAssetData>) => void;
  setActiveTab: (tab: string) => void;
  resetAsset: () => void;
  loadAsset: (json: string) => { success: boolean; error?: string };

  // Image actions
  addImages: (files: File[]) => Promise<void>;
  removeImage: (id: string) => void;
  clearImages: () => void;
  setSelectedFrame: (name: string | null) => void;
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

function buildSpritesheetFromPack(assetName: string, result: PackResult): ISpritesheetData {
  const frames: { [key: string]: ISpritesheetFrame } = {};
  for (const f of result.frames) {
    frames[f.name] = {
      frame: { x: f.x, y: f.y, w: f.w, h: f.h },
      rotated: false,
      trimmed: false,
      spriteSourceSize: { x: 0, y: 0, w: f.w, h: f.h },
      sourceSize: { w: f.w, h: f.h },
      pivot: { x: 0.5, y: 1.0 },
    };
  }
  return {
    meta: {
      app: 'Nitro Asset Creator',
      version: '1.0',
      image: `${assetName}.png`,
      format: 'RGBA8888',
      size: { w: result.sheetWidth, h: result.sheetHeight },
      scale: '1',
    },
    frames,
  };
}

function upsertAssets(existing: IAssetData['assets'], images: UploadedImage[]) {
  const assets = [...(existing ?? [])];
  for (const img of images) {
    if (!assets.find((a) => a.name === img.name)) {
      assets.push({ name: img.name, source: img.name, x: 0, y: 0 });
    }
  }
  return assets;
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  asset: defaultAsset,
  activeTab: 'general',
  images: [],
  packedSheetUrl: null,
  selectedFrameName: null,
  isRepacking: false,

  setAsset: (asset) => set({ asset }),

  updateAsset: (partial) =>
    set((state) => ({ asset: { ...state.asset, ...partial } })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  resetAsset: () =>
    set({ asset: { ...defaultAsset }, images: [], packedSheetUrl: null, selectedFrameName: null }),

  loadAsset: (json) => {
    try {
      const parsed = JSON.parse(json) as IAssetData;
      set({ asset: parsed });
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  },

  setSelectedFrame: (name) => set({ selectedFrameName: name }),

  addImages: async (files: File[]) => {
    set({ isRepacking: true });
    try {
      const newImgs = await Promise.all(files.map(readImageFile));
      const { images: current, asset } = get();
      // Deduplicate by name — new file wins
      const merged = [
        ...current.filter((c) => !newImgs.find((n) => n.name === c.name)),
        ...newImgs,
      ];
      const result = await packImages(merged);
      const spritesheet = result
        ? buildSpritesheetFromPack(asset.name ?? 'asset', result)
        : asset.spritesheet;
      const assets = result ? upsertAssets(asset.assets, merged) : asset.assets;
      set({
        images: merged,
        packedSheetUrl: result?.sheetDataUrl ?? null,
        asset: { ...asset, spritesheet, assets },
        isRepacking: false,
      });
    } catch {
      set({ isRepacking: false });
    }
  },

  removeImage: (id: string) => {
    const { images, asset } = get();
    const remaining = images.filter((img) => img.id !== id);
    const removedName = images.find((img) => img.id === id)?.name;
    set({ isRepacking: true });
    packImages(remaining)
      .then((result) => {
        const existingMeta = asset.spritesheet?.meta;
        const fallbackMeta: ISpritesheetMeta = {
          app: existingMeta?.app ?? 'Nitro Asset Creator',
          version: existingMeta?.version ?? '1.0',
          image: existingMeta?.image ?? `${asset.name ?? 'asset'}.png`,
          format: existingMeta?.format ?? 'RGBA8888',
          size: existingMeta?.size ?? { w: 1, h: 1 },
          scale: existingMeta?.scale ?? '1',
        };
        const currentFrames = (asset.spritesheet?.frames ?? {}) as Record<string, ISpritesheetFrame>;
        const keptFrames: Record<string, ISpritesheetFrame> = removedName
          ? Object.fromEntries(Object.entries(currentFrames).filter(([k]) => k !== removedName))
          : { ...currentFrames };
        const newSpritesheet: ISpritesheetData = result
          ? buildSpritesheetFromPack(asset.name ?? 'asset', result)
          : { meta: fallbackMeta, frames: keptFrames };
        set({
          images: remaining,
          packedSheetUrl: result?.sheetDataUrl ?? null,
          asset: { ...asset, spritesheet: newSpritesheet },
          isRepacking: false,
          selectedFrameName: get().selectedFrameName === removedName ? null : get().selectedFrameName,
        });
      })
      .catch(() => set({ isRepacking: false }));
  },

  clearImages: () => {
    const { asset } = get();
    set({
      images: [],
      packedSheetUrl: null,
      isRepacking: false,
      selectedFrameName: null,
      asset: { ...asset, spritesheet: { meta: asset.spritesheet?.meta, frames: {} } },
    });
  },
}));
