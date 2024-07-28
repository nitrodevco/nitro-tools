import { readFile } from 'fs/promises';
import { FetchRaw } from "./FetchRaw";

export const FetchBuffer = async (url: string) =>
{
    try
    {
        if (url.startsWith('//')) url = ('https:' + url);

        if (url.startsWith('http'))
        {
            const response = await FetchRaw(url);

            if (!response) return null;

            const arrayBuffer = await response.arrayBuffer();

            return Buffer.from(arrayBuffer);
        }
        else
        {
            return await readFile(url);
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return null;
}
