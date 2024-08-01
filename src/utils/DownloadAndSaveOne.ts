import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { pipeline } from 'stream/promises';
import { IFetchItem } from '../core';
import { DoesFileExist } from './DoesFileExist';
import { FetchRaw } from "./FetchRaw";
import { NitroConfiguration } from './NitroConfiguration';

export const DownloadAndSaveOne = async (item: IFetchItem) =>
{
    if (!item) return false;

    const outputPath = join(NitroConfiguration.outputPath, item.destination);

    if (!item.overwrite && await DoesFileExist(outputPath))
    {
        console.warn(`File already exists: ${outputPath}`);

        return true;
    }

    try
    {
        const response = await FetchRaw(item);

        if (!response || !response.ok) return false;

        await mkdir(dirname(outputPath), { recursive: true });
        await pipeline(response.body, createWriteStream(outputPath));

        return true;
    }

    catch (err)
    {
        console.error(err?.message ?? err);

        return false;
    }
}
