import { NitroConfiguration } from '../utils';
import { GenerateImageBundle } from './GenerateImageBundle';
import { GenerateSpriteSheet } from './GenerateSpritesheet';
import type { HabboAssetSWF } from './HabboAssetSWF';
import { SWFUtilities } from './SWFUtilities';

export const GenerateNitroBundleFromSwf = async (habboAssetSWF: HabboAssetSWF, assetType: string = null) => {
    const imageBundle = GenerateImageBundle(habboAssetSWF);
    const assetData = await SWFUtilities.mapXML2JSON(habboAssetSWF, assetType);

    let assetName = habboAssetSWF.getDocumentClass();

    if (assetData?.assets !== undefined) {
        assetData.assets = assetData.assets.filter(x => {
            if ((assetType === 'figure' || assetType === 'fx') && x.name.startsWith('sh_')) return false;

            const size = x.name.substring(assetName.length + 1).split('_')[0];

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

    if (assetName === 'HabboRoomContent') assetName = 'room';

    assetData.name = assetName;

    return SWFUtilities.createNitroBundle(assetName, assetData, spriteBundle);
};
