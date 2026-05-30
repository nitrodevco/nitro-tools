import { NitroConfiguration } from '../utils';
import { GenerateImageBundle } from './GenerateImageBundle';
import { GenerateSpriteSheet } from './GenerateSpritesheet';
import type { HabboAssetSWF } from './HabboAssetSWF';
import { SWFUtilities } from './SWFUtilities';

export const GenerateNitroBundleFromSwf = async (habboAssetSWF: HabboAssetSWF, assetType: string = null) => {
    const imageBundle = GenerateImageBundle(habboAssetSWF);
    const assetData = await SWFUtilities.mapXML2JSON(habboAssetSWF);

    const assetName = habboAssetSWF.getDocumentClass();

    if (assetData?.assets !== undefined) {
        assetData.assets = assetData.assets.filter(x => {
            if ((assetType === 'figure' || assetType === 'fx') && x.name.startsWith('sh_')) return false;

            const size = x.name.substring(assetData.type.length + 1).split('_')[0];

            if (assetData.type === 'room') {
                if (x.name.startsWith('wall_texture_32') || x.name.startsWith('floor_texture_32') || x.name.startsWith('landscape_32') || x.name.endsWith('_32') || x.name.endsWith('_32_flipH')) return false;
            }

            if (size === 'icon') return true;

            if (!isNaN(parseInt(size))) {
                if (NitroConfiguration.ALLOWED_SIZES.indexOf(parseInt(size)) === -1) return false;
            }

            return true;
        });

        for (const asset of assetData.assets) {
            if (asset.source !== undefined) {
                asset.source = imageBundle.sources[asset.source] ?? asset.source;

                if (imageBundle.getImage(asset.source) === undefined) {
                    delete asset.source;
                } else imageBundle.addImageReference(asset.source);
            }

            if (asset.name !== undefined && asset.source === undefined) {
                if (imageBundle.getImage(asset.name) !== undefined) {
                    imageBundle.addImageReference(asset.name);
                } else {
                    const source = imageBundle.sources[asset.name];

                    if (source !== undefined && imageBundle.getImage(source) !== undefined) {
                        asset.source = source;

                        imageBundle.addImageReference(asset.source);
                    }
                }
            }
        }
    }

    if (assetData?.visualizations !== undefined) {
        assetData.visualizations = assetData.visualizations.filter(x => {
            if (x.size !== undefined && !isNaN(x.size)) {
                if (NitroConfiguration.ALLOWED_SIZES.indexOf(x.size) === -1) return false;
            }

            return true;
        });
    }

    if (assetData?.logic?.particleSystems !== undefined) {
        assetData.logic.particleSystems = assetData.logic.particleSystems.filter(x => {
            if (x.size !== undefined && !isNaN(x.size)) {
                if (NitroConfiguration.ALLOWED_SIZES.indexOf(x.size) === -1) return false;
            }

            return true;
        });
    }

    const spriteBundle = await GenerateSpriteSheet(imageBundle, 'Pixi' as any);

    return SWFUtilities.createNitroBundle(assetName, assetData, spriteBundle);
};
