import ora from 'ora';
import { join } from 'path';

import { ExtractSwfFromBuffer, GenerateNitroBundleFromSwf } from '../swf';
import { FetchBuffer, File, NitroConfiguration, SaveBuffer } from '../utils';
import { GetFigureMap } from './GetFigureMap';

export const ConvertFigureSwfs = async () => {
    const figureMap = await GetFigureMap();

    if (!figureMap) return;

    const classNames = (NitroConfiguration.SKIP_CONVERTED_ASSETS ? figureMap.libraries.filter(x => {
        if (x.id === 'hh_pets' || x.id === 'hh_human_fx') return false;

        const filePath = new File(join(NitroConfiguration.OUTPUT_PATH, `./figures/${x.id}.nitro`));

        if (filePath.exists()) return false;

        return true;
    }) : figureMap.libraries).map(x => x.id);
    const totalItems = classNames.length;

    if (!totalItems) {
        console.log('✅ No figures to convert! All figures have already been converted.');

        return;
    }

    const spinner = ora(`Starting conversion of ${totalItems} figures...`).start();

    let totalConverted = 0;

    const convertItem = async (className: string) => {
        try {
            const buffer = await FetchBuffer({ url: join(NitroConfiguration.OUTPUT_PATH, `./swf/figures/${className}.swf`) });
            const habboAssetSwf = await ExtractSwfFromBuffer(buffer);
            const nitroBundle = await GenerateNitroBundleFromSwf(habboAssetSwf);
            const nitroBuffer = await nitroBundle.toArrayBufferAsync();

            await SaveBuffer(Buffer.from(nitroBuffer), `./figures/${className}.nitro`);

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

    spinner.succeed(`Conversion complete! ${totalConverted} out of ${totalItems} figures converted successfully.`);
};
