import type { AssetXML, IAsset, IAssetData, IAssetPalette, PaletteXML } from '../../core';
import { AssetsXML } from '../../core';

export class AssetMapper {
    public static mapXML(assets: any, output: IAssetData): void {
        if (!assets || !output) return;

        AssetMapper.mapAssetsXML(new AssetsXML(assets.assets), output);
    }

    private static mapAssetsXML(xml: AssetsXML, output: IAssetData): void {
        if (!xml || !output) return;

        if (xml.assets !== undefined) {
            if (xml.assets.length) {
                output.assets = [];

                AssetMapper.mapAssetsAssetXML(xml.assets, output.assets);
            }
        }

        if (xml.palettes !== undefined) {
            if (xml.palettes.length) {
                output.palettes = [];

                AssetMapper.mapAssetsPaletteXML(xml.palettes, output.palettes);
            }
        }
    }

    private static mapAssetsAssetXML(xml: AssetXML[], output: IAsset[]): void {
        if (!xml || !xml.length || !output) return;

        for (const assetXML of xml) {
            const asset: IAsset = {};

            if (assetXML.name !== undefined) asset.name = assetXML.name;
            if (assetXML.source !== undefined) asset.source = assetXML.source;

            asset.x = assetXML.x ?? 0;
            asset.y = assetXML.y ?? 0;

            if (assetXML.flipH !== undefined) asset.flipH = assetXML.flipH;
            if (assetXML.flipV !== undefined) asset.flipV = assetXML.flipV;
            if (assetXML.usesPalette !== undefined) asset.usesPalette = assetXML.usesPalette;

            output.push(asset);
        }
    }

    private static mapAssetsPaletteXML(xml: PaletteXML[], output: IAssetPalette[]): void {
        if (!xml || !xml.length || !output) return;

        for (const paletteXML of xml) {
            const palette: IAssetPalette = {};

            if (paletteXML.id !== undefined) palette.id = paletteXML.id;
            if (paletteXML.source !== undefined) palette.source = paletteXML.source;
            if (paletteXML.master !== undefined) palette.master = paletteXML.master;
            if (paletteXML.tags !== undefined) palette.tags = paletteXML.tags;
            if (paletteXML.breed !== undefined) palette.breed = paletteXML.breed;
            if (paletteXML.colorTag !== undefined) palette.colorTag = paletteXML.colorTag;
            if (paletteXML.color1 !== undefined) palette.color1 = paletteXML.color1;
            if (paletteXML.color2 !== undefined) palette.color2 = paletteXML.color2;

            output.push(palette);
        }
    }
}
