import { join } from 'path';
import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, NitroConfiguration, SaveBuffer } from '../utils';
import { GetAllFurnitureClassNames } from './GetAllFurnitureClassNames';

const batchCount: number = 100;

export const ConvertFurnitureSwfs = async () =>
{
    const classNames = await GetAllFurnitureClassNames();

    if (!classNames || !classNames.length) return;

    let promises: Promise<void>[] = [];
    let count = 0;

    for (const className of classNames)
    {
        promises.push(
            FetchBuffer({ url: join(NitroConfiguration.outputPath, `./swf/furniture/${className}.swf`) })
                .then(buffer => ExtractSwfFromBuffer(buffer))
                .then(habboAssetSwf => GenerateNitroBundleFromSwf(habboAssetSwf))
                .then(nitroBundle => nitroBundle.toBufferAsync())
                .then(buffer => SaveBuffer(buffer, `./bundled/furniture/${className}.nitro`))
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
