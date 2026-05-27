import { join } from 'path';

import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, File, NitroConfiguration, SaveBuffer } from '../utils';
import { GetEffectMap } from './GetEffectMap';


export const ConvertEffectSwfs = async () => {
    const effectMap = await GetEffectMap();

    if (!effectMap || !effectMap.effects || !effectMap.effects.length) return;

    let promises: Promise<void>[] = [];
    let count = 0;

    for (const library of effectMap.effects) {
        if (NitroConfiguration.SKIP_CONVERTED_ASSETS) {
            const filePath = new File(join(NitroConfiguration.OUTPUT_PATH, `./effects/${library.lib}.nitro`));

            if (filePath.exists()) continue;
        }

        promises.push(
            FetchBuffer({ url: join(NitroConfiguration.OUTPUT_PATH, `./swf/effects/${library.lib}.swf`) })
                .then(buffer => ExtractSwfFromBuffer(buffer))
                .then(habboAssetSwf => GenerateNitroBundleFromSwf(habboAssetSwf))
                .then(nitroBundle => nitroBundle.toArrayBufferAsync())
                .then(buffer => SaveBuffer(buffer, `./effects/${library.lib}.nitro`))
                .catch(err => console.error(err?.message ?? err)));

        count++;

        if (count === NitroConfiguration.BATCH_SIZE) {
            await Promise.allSettled(promises);

            promises = [];
            count = 0;
        }
    }

    if (count > 0) {
        await Promise.allSettled(promises);

        promises = [];
        count = 0;
    }
};
