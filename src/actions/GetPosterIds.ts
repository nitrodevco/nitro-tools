import { GetExternalTexts } from './GetExternalTexts';

let posterIds: number[] = null;

export const GetPosterIds = async () =>
{
    try
    {
        if (!posterIds)
        {
            const texts = await GetExternalTexts();

            posterIds = [];

            Object.keys(texts).forEach((key) =>
            {
                const match = key.match(/poster_(\d+)_/);

                if (match)
                {
                    const posterId = Number(match[1].trim());

                    if (posterIds.indexOf(posterId) >= 0) return;

                    posterIds.push(posterId);
                }
            });
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return posterIds;
}
