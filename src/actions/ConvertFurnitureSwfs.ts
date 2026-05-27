import { join } from 'path';

import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, File, NitroConfiguration, SaveBuffer } from '../utils';
import { GetAllFurnitureClassNames } from './GetAllFurnitureClassNames';

export const ConvertFurnitureSwfs = async () => {
    const classNames = await GetAllFurnitureClassNames();

    if (!classNames || !classNames.length) return;

    let promises: Promise<void>[] = [];
    let count = 0;

    for (const className of classNames) {
        if (NitroConfiguration.SKIP_CONVERTED_ASSETS) {
            const filePath = new File(join(NitroConfiguration.OUTPUT_PATH, `./furniture/${className}.nitro`));

            if (filePath.exists()) continue;
        }

        promises.push(
            FetchBuffer({ url: join(NitroConfiguration.OUTPUT_PATH, `./swf/furniture/${className}.swf`) })
                .then(buffer => ExtractSwfFromBuffer(buffer))
                .then(habboAssetSwf => GenerateNitroBundleFromSwf(habboAssetSwf))
                .then(nitroBundle => nitroBundle.toArrayBufferAsync())
                .then(buffer => SaveBuffer(buffer, `./furniture/${className}.nitro`))
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
