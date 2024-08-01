import fetch from 'node-fetch';
import { IFetchItem } from '../core';
import { FetchOptions } from './FetchOptions';

export const FetchRaw = async (item: IFetchItem) =>
{
    if (!item || !item.url) throw new Error('Invalid fetch item');

    const response = await fetch(item.url, FetchOptions);

    if (!response || !response.ok)
    {
        if (item.alternateUrl && item.alternateUrl.length) return FetchRaw({ ...item, url: item.alternateUrl, alternateUrl: null });

        throw new Error(`Failed to fetch: ${item.url}`);
    }

    console.log(`Fetched ${item.url}`);

    return response;
}
