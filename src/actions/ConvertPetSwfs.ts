import { join } from 'path';

import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, File, NitroConfiguration, SaveBuffer } from '../utils';
import { GetPetNames } from './GetPetNames';

export const ConvertPetSwfs = async () => {
    const petNames = await GetPetNames();

    if (!petNames || !petNames.length) return;

    let promises: Promise<void>[] = [];
    let count = 0;

    for (const petName of petNames) {
        if (NitroConfiguration.SKIP_CONVERTED_ASSETS) {
            const filePath = new File(join(NitroConfiguration.OUTPUT_PATH, `./pets/${petName}.nitro`));

            if (filePath.exists()) continue;
        }

        promises.push(
            FetchBuffer({ url: join(NitroConfiguration.OUTPUT_PATH, `./swf/pets/${petName}.swf`) })
                .then(buffer => ExtractSwfFromBuffer(buffer))
                .then(habboAssetSwf => GenerateNitroBundleFromSwf(habboAssetSwf))
                .then(nitroBundle => nitroBundle.toArrayBufferAsync())
                .then(buffer => SaveBuffer(buffer, `./pets/${petName}.nitro`))
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
