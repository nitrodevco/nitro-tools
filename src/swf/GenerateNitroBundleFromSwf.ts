import { GenerateImageBundle } from './GenerateImageBundle';
import { GenerateSpriteSheet } from './GenerateSpritesheet';
import type { HabboAssetSWF } from './HabboAssetSWF';
import { SWFUtilities } from './SWFUtilities';

export const GenerateNitroBundleFromSwf = async (habboAssetSWF: HabboAssetSWF, assetType: string = null) => {
    const imageBundle = GenerateImageBundle(habboAssetSWF);
    const assetData = await SWFUtilities.mapXML2JSON(habboAssetSWF, assetType);

    if (assetData && assetData.assets !== undefined) {
        for (const asset of assetData.assets) {
            if (asset.name.includes('_32_')) continue;

            if (asset.source !== undefined) {
                asset.source = imageBundle.sources[asset.source] ?? asset.source;

                if (imageBundle.getImage(asset.source) === undefined) {
                    delete asset.source;
                } else imageBundle.addImageReference(asset.source);
            }

            if (asset.name !== undefined && asset.source === undefined) {
                asset.name = imageBundle.sources[asset.name] ?? asset.name;

                if (imageBundle.getImage(asset.name) !== undefined) imageBundle.addImageReference(asset.name);
            }
        }
    }

    const spriteBundle = await GenerateSpriteSheet(imageBundle, 'Pixi' as any);

    let assetName = habboAssetSWF.getDocumentClass();

    if (assetName === 'HabboRoomContent') assetName = 'room';

    assetData.name = assetName;

    return SWFUtilities.createNitroBundle(assetName, assetData, spriteBundle);
};
