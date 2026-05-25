import JSZip from 'jszip';
import type { IAssetData } from '../types/nitro';

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

export async function downloadNitroBundle(asset: IAssetData) {
  const zip = new JSZip();
  const name = asset.name ?? 'asset';
  const json = JSON.stringify(asset, null, 2);

  zip.file(`${name}.json`, json);

  // placeholder spritesheet JSON if not provided via actual spritesheet data
  if (!asset.spritesheet) {
    const spritesheetJson = JSON.stringify(
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
  const json = JSON.stringify(asset, null, 2);
  navigator.clipboard.writeText(json);
}
