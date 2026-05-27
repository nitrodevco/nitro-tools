import ora from 'ora';
import { join } from 'path';

import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, File, NitroConfiguration, SaveBuffer } from '../utils';
import { GetPetNames } from './GetPetNames';

export const ConvertPetSwfs = async () => {
    const petNames = await GetPetNames();

    if (!petNames) return;

    const classNames = (NitroConfiguration.SKIP_CONVERTED_ASSETS ? petNames.filter(x => {
        const filePath = new File(join(NitroConfiguration.OUTPUT_PATH, `./pets/${x}.nitro`));

        if (filePath.exists()) return false;

        return true;
    }) : petNames)
    const totalItems = classNames.length;

    if (!totalItems) {
        console.log('✅ No pets to convert! All pets have already been converted.');

        return;
    }

    const spinner = ora(`Starting conversion of ${totalItems} pets...`).start();

    let totalConverted = 0;

    const convertItem = async (className: string) => {
        try {
            const buffer = await FetchBuffer({ url: join(NitroConfiguration.OUTPUT_PATH, `./swf/pets/${className}.swf`) });
            const habboAssetSwf = await ExtractSwfFromBuffer(buffer);
            const nitroBundle = await GenerateNitroBundleFromSwf(habboAssetSwf);
            const nitroBuffer = await nitroBundle.toArrayBufferAsync();

            await SaveBuffer(Buffer.from(nitroBuffer), `./pets/${className}.nitro`);

            spinner.text = `✅ ${className} converted successfully! (${++totalConverted}/${totalItems})`;
        }

        catch (err) {
            console.error(`❌ ${className} failed:`, err?.message ?? err);
        }
    }

    for (let i = 0; i < totalItems; i += NitroConfiguration.BATCH_SIZE) {
        const batch = classNames.slice(i, i + NitroConfiguration.BATCH_SIZE);

        await Promise.allSettled(batch.map(item => convertItem(item)));
    }

    spinner.succeed(`Conversion complete! ${totalConverted} out of ${totalItems} pets converted successfully.`);
};
