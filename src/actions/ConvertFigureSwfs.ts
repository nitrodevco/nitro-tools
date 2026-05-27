import { join } from 'path';

import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, File, NitroConfiguration, SaveBuffer } from '../utils';
import { GetFigureMap } from './GetFigureMap';

export const ConvertFigureSwfs = async () => {
    const figureMap = await GetFigureMap();

    if (!figureMap || !figureMap.libraries || !figureMap.libraries.length) return;

    let promises: Promise<void>[] = [];
    let count = 0;

    for (const library of figureMap.libraries) {
        if (library.id === 'hh_human_fx' || library.id === 'hh_human_pets') continue;

        if (NitroConfiguration.SKIP_CONVERTED_ASSETS) {
            const filePath = new File(join(NitroConfiguration.OUTPUT_PATH, `./figures/${library.id}.nitro`));

            if (filePath.exists()) continue;
        }

        promises.push(
            FetchBuffer({ url: join(NitroConfiguration.OUTPUT_PATH, `./swf/figures/${library.id}.swf`) })
                .then(buffer => ExtractSwfFromBuffer(buffer))
                .then(habboAssetSwf => GenerateNitroBundleFromSwf(habboAssetSwf))
                .then(nitroBundle => nitroBundle.toArrayBufferAsync())
                .then(buffer => SaveBuffer(buffer, `./figures/${library.id}.nitro`))
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
