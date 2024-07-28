import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { pipeline } from 'stream/promises';
import { NitroConfiguration } from './NitroConfiguration';

export const SaveJson = async (json: Object, destination: string) =>
{
    try
    {
        const outputPath = join(NitroConfiguration.outputPath, destination);

        await mkdir(dirname(outputPath), { recursive: true });
        await pipeline(JSON.stringify(json), createWriteStream(outputPath));
    }

    catch (err)
    {
        console.error(err);
    }
}
