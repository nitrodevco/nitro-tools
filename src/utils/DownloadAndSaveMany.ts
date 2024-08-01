import { IFetchItem } from '../core';
import { DownloadAndSaveOne } from './DownloadAndSaveOne';

export const DownloadAndSaveMany = async (items: IFetchItem[], overwrite: boolean = false) =>
{
    await Promise.allSettled([
        ...items.map(item => item && DownloadAndSaveOne({ ...item, overwrite }))
    ]);
}
