import { GenerateSpriteSheet } from './GenerateSpritesheet';
import type { HabboAssetSWF } from './HabboAssetSWF';
import { SWFUtilities } from './SWFUtilities';

export const GenerateNitroBundleFromSwf = async (habboAssetSWF: HabboAssetSWF, assetType: string = null) => {
    if (!habboAssetSWF) return null;

    const imageBundle = habboAssetSWF.getImageBundle();
    const assetData = await SWFUtilities.mapXML2JSON(habboAssetSWF, assetType);
    const spriteBundle = await GenerateSpriteSheet(imageBundle, 'Pixi' as any);

    let assetName = habboAssetSWF.getDocumentClass();

    if (assetName === 'HabboRoomContent') assetName = 'room';

    assetData.name = assetName;

    return SWFUtilities.createNitroBundle(assetName, assetData, spriteBundle);
};
