import type { Response } from 'node-fetch';
import fetch from 'node-fetch';

import type { IFetchItem } from '../core';
import { FetchOptions } from './FetchOptions';

export const FetchRaw = async (item: IFetchItem): Promise<Response> => {
    if (!item || !item.url) throw new Error('Invalid fetch item');

    const response = await fetch(item.url, FetchOptions);

    if (!response || !response.ok) {
        if (item.alternateUrl && item.alternateUrl.length) return FetchRaw({ ...item, url: item.alternateUrl, alternateUrl: null });

        throw new Error(`Failed to fetch: ${item.url}`);
    }

    return response;
};
