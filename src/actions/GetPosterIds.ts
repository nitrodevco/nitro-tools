import { GetExternalTexts } from './GetExternalTexts';

export const GetPosterIds = async () =>
{
    const texts = await GetExternalTexts();
    const posters = new Set<number>();

    Array.from(Object.keys(texts)).forEach((key) =>
    {
        const match = key.match(/poster_(\d+)_/);

        if (match)
        {
            const posterId = Number(match[1].trim());

            if (posters.has(posterId)) return;

            posters.add(posterId);
        }
    });

    return [...posters];
}
