import { HabboAssetSWF } from './HabboAssetSWF';

export const ExtractSwfFromBuffer = async (buffer: Buffer) =>
{
    const habboAssetSWF = new HabboAssetSWF(buffer);

    await habboAssetSWF.setupAsync();

    return habboAssetSWF;
}
