import { inflateSync } from 'zlib';
import { DecompressLZMA } from './DecompressLZMA';
import { ReadSWFBuff } from './ReadSWFBuffer';
import { SWFBuffer } from './SWFBuffer';

export const UncompressSWF = async (buffer: Buffer) =>
{
    const signature = buffer.toString('utf8', 0, 3);
    const version = buffer.readUInt8(3);
    const fileSize = buffer.readUInt32LE(4);

    let decompressedBuffer: Buffer = null;

    switch (signature)
    {
        case 'FWS': // Uncompressed
            decompressedBuffer = buffer;
            break;
        case 'CWS': // Compressed with zlib
            decompressedBuffer = Buffer.concat([
                buffer.slice(0, 8), // Header remains unchanged
                inflateSync(buffer.slice(8))
            ]);
            break;
        case 'ZWS': // Compressed with LZMA
            decompressedBuffer = await DecompressLZMA(buffer);
            break;
        default:
            console.warn('Unsupported SWF signature:', signature);
    }

    return ReadSWFBuff(new SWFBuffer(decompressedBuffer), buffer);
}
