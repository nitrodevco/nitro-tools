import { join } from 'path';
import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, NitroConfiguration, SaveBuffer } from '../utils';
import { GetFigureMap } from './GetFigureMap';

const batchCount: number = 100;

export const ConvertFigureSwfs = async () =>
{
    const figureMap = await GetFigureMap();

    if (!figureMap || !figureMap.libraries || !figureMap.libraries.length) return;

    let promises: Promise<void>[] = [];
    let count = 0;

    for (const library of figureMap.libraries)
    {
        promises.push(
            FetchBuffer({ url: join(NitroConfiguration.outputPath, `./swf/figures/${library.id}.swf`) })
                .then(buffer => ExtractSwfFromBuffer(buffer))
                .then(habboAssetSwf => GenerateNitroBundleFromSwf(habboAssetSwf))
                .then(nitroBundle => nitroBundle.toBufferAsync())
                .then(buffer => SaveBuffer(buffer, `./bundled/figures/${library.id}.nitro`))
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
