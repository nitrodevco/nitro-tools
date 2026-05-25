import JSZip from 'jszip';
import type { IAssetData } from '../types/nitro';

export interface NitroBundleContents {
  assetData: IAssetData;
  sheetDataUrl: string | null;
}

export async function readNitroBundle(file: File): Promise<NitroBundleContents> {
  const zip = await JSZip.loadAsync(file);
  const keys = Object.keys(zip.files);

  const jsonKey = keys.find((k) => k.endsWith('.json') && !k.endsWith('_spritesheet.json'));
  if (!jsonKey) throw new Error('No asset JSON found in .nitro bundle');

  const jsonText = await zip.files[jsonKey].async('string');
  const assetData = JSON.parse(jsonText) as IAssetData;

  const pngKey = keys.find((k) => k.endsWith('.png'));
  let sheetDataUrl: string | null = null;
  if (pngKey) {
    const base64 = await zip.files[pngKey].async('base64');
    sheetDataUrl = `data:image/png;base64,${base64}`;
  }

  return { assetData, sheetDataUrl };
}

export function downloadJson(asset: IAssetData) {
  const json = JSON.stringify(asset, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${asset.name ?? 'asset'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadNitroBundle(asset: IAssetData, packedSheetUrl: string | null = null) {
  const zip = new JSZip();
  const name = asset.name ?? 'asset';

  // JSON metadata
  zip.file(`${name}.json`, JSON.stringify(asset, null, 2));

  // Spritesheet JSON
  const spritesheetJson = asset.spritesheet
    ? JSON.stringify(asset.spritesheet, null, 2)
    : JSON.stringify(
        {
          meta: {
            app: 'Nitro Asset Creator',
            version: '1.0',
            image: `${name}.png`,
            format: 'RGBA8888',
            size: { w: 1, h: 1 },
            scale: '1',
          },
          frames: {},
        },
        null,
        2,
      );
  zip.file(`${name}_spritesheet.json`, spritesheetJson);

  // PNG — use the real packed sheet if available, otherwise a 1×1 transparent placeholder
  if (packedSheetUrl) {
    const base64 = packedSheetUrl.split(',')[1];
    zip.file(`${name}.png`, base64, { base64: true });
  } else {
    // 1×1 transparent PNG (smallest valid PNG)
    const placeholder =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    zip.file(`${name}.png`, placeholder, { base64: true });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.nitro`;
  a.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(asset: IAssetData) {
  navigator.clipboard.writeText(JSON.stringify(asset, null, 2));
}
