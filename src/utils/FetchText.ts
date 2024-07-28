import { FetchBuffer } from './FetchBuffer';

export const FetchText = async (url: string) =>
{
    try
    {
        const response = await FetchBuffer(url);

        if (!response) return null;

        return response.toString('utf-8');
    }

    catch (err)
    {
        console.error(err);
    }

    return null;
}
