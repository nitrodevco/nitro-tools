import { IFetchItem } from '../core';
import { DownloadAndSaveOne } from './DownloadAndSaveOne';

export const DownloadAndSaveUntil = async (item: IFetchItem, maxTries: number = 3, i: number = 1, failed: number = 0) =>
{
    if (await DownloadAndSaveOne({ ...item, url: item.url.replace('%i%', i.toString()), destination: item.destination.replace('%i%', i.toString()) }))
    {
        failed = 0;
    }
    else
    {
        failed++;
    }

    if (failed < maxTries)
    {
        await DownloadAndSaveUntil(item, maxTries, ++i, failed);
    }
}
