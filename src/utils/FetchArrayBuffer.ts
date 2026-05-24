import { readFile } from 'fs/promises';
import { IFetchItem } from '../core';
import { FetchRaw } from './FetchRaw';

export const FetchArrayBuffer = async (item: IFetchItem): Promise<ArrayBuffer> =>
{
    if(!item || !item.url) throw new Error('Invalid fetch item');

    if(item.url.startsWith('//')) item.url = ('https:' + item.url);

    if(item.url.startsWith('http'))
    {
        const response = await FetchRaw(item);

        if(!response || !response.ok) throw new Error(`Failed to fetch: ${item.url}`);

        return await response.arrayBuffer();
    }
    else
    {
        var buffer = await readFile(item.url);

        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    }
};
