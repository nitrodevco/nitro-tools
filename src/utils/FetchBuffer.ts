import { readFile } from 'fs/promises';
import { IFetchItem } from '../core';
import { FetchRaw } from './FetchRaw';

export const FetchBuffer = async (item: IFetchItem) =>
{
    if (!item || !item.url) throw new Error('Invalid fetch item');

    if (item.url.startsWith('//')) item.url = ('https:' + item.url);

    if (item.url.startsWith('http'))
    {
        const response = await FetchRaw(item);

        if (!response || !response.ok) throw new Error(`Failed to fetch: ${item.url}`);

        return Buffer.from(await response.arrayBuffer());
    }
    else
    {
        return await readFile(item.url);
    }
}
