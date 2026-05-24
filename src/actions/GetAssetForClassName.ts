import { join } from 'path';
import { IAssetData } from '../core';
import { FetchArrayBuffer, NitroBundle, NitroConfiguration } from '../utils';

const cachedAssetDatas: Map<string, IAssetData> = new Map();
const assetPromises: Map<string, Promise<IAssetData>> = new Map();

export const GetAssetForClassName = async (className: string) =>
{
    try
    {
        if(!className || !className.length) return null;

        let cached = cachedAssetDatas.get(className);

        if(cached) return cached;

        const existingPromise = assetPromises.get(className);

        if (existingPromise) return existingPromise;

        const load = (async () =>
        {
            const buffer = await FetchArrayBuffer({ url: join(NitroConfiguration.outputPath, `./furniture/${className}.nitro`) });

            const bundle = await NitroBundle.fromZip(buffer);

            for(const [fileName, content] of bundle.files.entries())
            {
                if(!fileName.endsWith('.json')) continue;

                cached = JSON.parse(content.toString('utf8'));

                cachedAssetDatas.set(className, cached);

                return cached;
            };
        })()
        .finally(() =>
        {
            assetPromises.delete(className);
        });

        assetPromises.set(className, load);

        return load;
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }
};
