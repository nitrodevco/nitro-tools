import { IFetchItem } from '../core';
import { DownloadAndSaveOne } from './DownloadAndSaveOne';

const batchCount = 100;

export const DownloadAndSaveMany = async (items: IFetchItem[], overwrite: boolean = false) =>
{
    let promises: Promise<boolean>[] = [];
    let count = 0;

    for (const item of items)
    {
        promises.push(DownloadAndSaveOne({ ...item, overwrite }));

        count++;

        if (count === batchCount)
        {
            await Promise.allSettled(promises);

            promises = [];
            count = 0;
        }
    }

    if (count > 0)
    {
        await Promise.allSettled(promises);

        promises = [];
        count = 0;
    }
}
