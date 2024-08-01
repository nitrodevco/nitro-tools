import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { NitroConfiguration } from './NitroConfiguration';

export const SaveJson = async (json: Object, destination: string) =>
{
    try
    {
        const outputPath = join(NitroConfiguration.outputPath, destination);

        await mkdir(dirname(outputPath), { recursive: true });

        const writeStream = createWriteStream(outputPath);

        writeStream.write(JSON.stringify(json));
        writeStream.close();
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }
}
