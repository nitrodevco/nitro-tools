import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';

import { NitroConfiguration } from './NitroConfiguration';

export const SaveBlob = async (blob: Blob, destination: string) => {
    try {
        const outputPath = join(NitroConfiguration.OUTPUT_PATH, destination);

        await mkdir(dirname(outputPath), { recursive: true });

        const writeStream = createWriteStream(outputPath);

        writeStream.write(blob);
        writeStream.close();
    }

    catch (err) {
        console.error(err?.message ?? err);
    }
};
