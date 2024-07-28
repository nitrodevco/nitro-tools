import { IFetchItem } from '../core';
import { DownloadAndSaveOne } from './DownloadAndSaveOne';

export const DownloadAndSaveMany = async (items: IFetchItem[], overwrite: boolean = false) =>
{
    try
    {
        await Promise.allSettled(
            items.map(item => item && DownloadAndSaveOne(item.url, item.destination, overwrite))
        );
    }

    catch (err)
    {
        console.error(err);
    }
}
