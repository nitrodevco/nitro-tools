import { readFile } from 'fs/promises';
import { FetchRaw } from "./FetchRaw";

export const FetchJson = async <T>(url: string): Promise<T> =>
{
    try
    {
        if (url.startsWith('//')) url = ('https:' + url);

        if (url.startsWith('http'))
        {
            const response = await FetchRaw(url);

            if (!response) return null;

            return await response.json() as T;
        }
        else
        {
            const response = await readFile(url);

            return JSON.parse(response.toString('utf-8')) as T;
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return null;
}
