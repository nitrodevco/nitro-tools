import fetch from 'node-fetch';
import { FetchOptions } from './FetchOptions';

export const FetchRaw = async (url: string) =>
{
    try
    {
        const response = await fetch(url, FetchOptions);

        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        console.log(`Fetched ${url}`);

        return response;
    }

    catch (err)
    {
        console.log(err.message);
    }

    return null;
}
