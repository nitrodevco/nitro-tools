import type { IFetchItem } from '../core';
import { FetchArrayBuffer } from './FetchArrayBuffer';

export const FetchBuffer = async (item: IFetchItem) => {
    const arrayBuffer = await FetchArrayBuffer(item);

    return Buffer.from(arrayBuffer);
};
