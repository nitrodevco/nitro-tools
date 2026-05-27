import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

import { NitroConfiguration } from './NitroConfiguration';

export const SaveBuffer = async (buffer: Buffer, destination: string) => {
    try {
        const outputPath = join(NitroConfiguration.OUTPUT_PATH, destination);

        await mkdir(dirname(outputPath), { recursive: true });

        const readable = Readable.from(buffer);
        const writable = createWriteStream(outputPath);

        await pipeline(readable, writable);
    }

    catch (err) {
        console.error(err?.message ?? err);

        throw err;
    }
};
