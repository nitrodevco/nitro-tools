import { readFile } from 'fs/promises';
import { IFetchItem } from '../core';
import { FetchRaw } from './FetchRaw';

export const FetchJson = async <T>(item: IFetchItem): Promise<T> =>
{
    if (!item || !item.url) throw new Error('Invalid fetch item');

    if (item.url.startsWith('//')) item.url = ('https:' + item.url);

    if (item.url.startsWith('http'))
    {
        const response = await FetchRaw(item);

        if (!response || !response.ok) throw new Error(`Failed to fetch: ${item.url}`);

        return await response.json() as T;
    }
    else
    {
        const response = await readFile(item.url);

        return JSON.parse(response.toString('utf-8')) as T;
    }
}
