import { join } from 'path';
import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, NitroConfiguration, SaveBuffer } from '../utils';
import { GetEffectMap } from './GetEffectMap';

const batchCount: number = 100;

export const ConvertEffectSwfs = async () =>
{
    const effectMap = await GetEffectMap();

    if (!effectMap || !effectMap.effects || !effectMap.effects.length) return;

    let promises: Promise<void>[] = [];
    let count = 0;

    for (const library of effectMap.effects)
    {
        promises.push(
            FetchBuffer({ url: join(NitroConfiguration.outputPath, `./swf/effects/${library.lib}.swf`) })
                .then(buffer => ExtractSwfFromBuffer(buffer))
                .then(habboAssetSwf => GenerateNitroBundleFromSwf(habboAssetSwf))
                .then(nitroBundle => nitroBundle.toBufferAsync())
                .then(buffer => SaveBuffer(buffer, `./bundled/effects/${library.lib}.nitro`))
                .catch(err => console.error(err?.message ?? err)));

        count++;

        if (count === batchCount)
        {
            await Promise.allSettled(promises);

            promises = [];
            count = 0;
        }
    }

    if (count > 0)
    {
        await Promise.allSettled(promises);

        promises = [];
        count = 0;
    }
}
