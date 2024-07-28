import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { pipeline } from 'stream/promises';
import { DoesFileExist } from './DoesFileExist';
import { FetchRaw } from "./FetchRaw";
import { NitroConfiguration } from './NitroConfiguration';

export const DownloadAndSaveOne = async (url: string, destination: string, overwrite: boolean = false) =>
{
    try
    {
        const outputPath = join(NitroConfiguration.outputPath, destination);

        if (!overwrite && await DoesFileExist(outputPath)) return;

        const response = await FetchRaw(url);

        if (!response) return;

        await mkdir(dirname(outputPath), { recursive: true });
        await pipeline(response.body, createWriteStream(outputPath));
    }

    catch (err)
    {
        console.error(err);
    }
}
