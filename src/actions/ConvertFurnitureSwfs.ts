import ora from 'ora';
import { join } from 'path';

import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, File, NitroConfiguration, SaveBuffer } from '../utils';
import { GetAllFurnitureClassNames } from './GetAllFurnitureClassNames';

export const ConvertFurnitureSwfs = async () => {
    let classNames = await GetAllFurnitureClassNames();

    if (!classNames) return;

    classNames = (NitroConfiguration.SKIP_CONVERTED_ASSETS ? classNames.filter(x => {
        const filePath = new File(join(NitroConfiguration.OUTPUT_PATH, `./furniture/${x}.nitro`));

        if (filePath.exists()) return false;

        return true;
    }) : classNames)
    const totalItems = classNames.length;

    if (!totalItems) {
        console.log('✅ No furniture to convert! All furniture have already been converted.');

        return;
    }

    const spinner = ora(`Starting conversion of ${totalItems} furniture...`).start();

    let totalConverted = 0;

    const convertItem = async (className: string) => {
        try {
            const buffer = await FetchBuffer({ url: join(NitroConfiguration.OUTPUT_PATH, `./swf/furniture/${className}.swf`) });
            const habboAssetSwf = await ExtractSwfFromBuffer(buffer);
            const nitroBundle = await GenerateNitroBundleFromSwf(habboAssetSwf);
            const nitroBuffer = await nitroBundle.toArrayBufferAsync();

            await SaveBuffer(Buffer.from(nitroBuffer), `./furniture/${className}.nitro`);

            spinner.text = `✅ ${className} converted successfully! (${++totalConverted}/${totalItems})`;
        }

        catch (err) {
            console.error(`❌ ${className} failed:`, err?.message ?? err);
        }
    }

    for (let i = 0; i < totalItems; i += NitroConfiguration.BATCH_SIZE) {
        const batch = classNames.slice(i, i + NitroConfiguration.BATCH_SIZE);

        try {
            await Promise.allSettled(batch.map(item => convertItem(item)));
        } catch (err) {
            console.error('Error converting batch:', err?.message ?? err);
        }
    }

    spinner.succeed(`Conversion complete! ${totalConverted} out of ${totalItems} furniture converted successfully.`);
};
