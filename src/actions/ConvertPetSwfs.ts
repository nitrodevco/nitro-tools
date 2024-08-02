import { join } from 'path';
import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, NitroConfiguration, SaveBuffer } from '../utils';
import { GetPetNames } from './GetPetNames';

const batchCount: number = 100;

export const ConvertPetSwfs = async () =>
{
    const petNames = await GetPetNames();

    if (!petNames || !petNames.length) return;

    let promises: Promise<void>[] = [];
    let count = 0;

    for (const petName of petNames)
    {
        promises.push(
            FetchBuffer({ url: join(NitroConfiguration.outputPath, `./swf/pets/${petName}.swf`) })
                .then(buffer => ExtractSwfFromBuffer(buffer))
                .then(habboAssetSwf => GenerateNitroBundleFromSwf(habboAssetSwf))
                .then(nitroBundle => nitroBundle.toBufferAsync())
                .then(buffer => SaveBuffer(buffer, `./bundled/pets/${petName}.nitro`))
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
