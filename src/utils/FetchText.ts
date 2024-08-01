import { IFetchItem } from '../core';
import { FetchBuffer } from './FetchBuffer';

export const FetchText = async (item: IFetchItem) =>
{
    const response = await FetchBuffer(item);

    if (!response) throw new Error(`Failed to fetch: ${item.url}`);

    return response.toString('utf-8');
}
