import lzma from 'lzma-native';

export const DecompressLZMA = async (buffer: Buffer): Promise<Buffer> =>
{
    return new Promise((resolve, reject) =>
    {
        const properties = buffer.slice(12, 17);
        const compressedData = buffer.slice(17, buffer.length - 4);
        const uncompressedSize = buffer.readUInt32LE(buffer.length - 4);
        const decompressor = lzma.createDecompressor();

        decompressor.write(properties);
        decompressor.write(compressedData);
        decompressor.end();

        const chunks = [];

        decompressor.on('data', chunk => chunks.push(chunk));
        decompressor.on('end', () =>
        {
            const decompressedBuffer = Buffer.concat(chunks);

            if (decompressedBuffer.length !== uncompressedSize)
            {
                reject(new Error('Decompressed size does not match the expected size.'));

                return;
            }

            resolve(Buffer.concat([buffer.slice(0, 8), decompressedBuffer]));

            return;
        });

        decompressor.on('error', reject);
    });
}
