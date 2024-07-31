import { GetExternalTexts } from './GetExternalTexts';

let badgeNames: string[] = null;
let regex = /(?:badge_name_(\w+)|(\w+)_badge_name)/g;

export const GetBadgeNames = async () =>
{
    try
    {
        if (!badgeNames)
        {
            const texts = await GetExternalTexts();

            badgeNames = [];

            Object.keys(texts).forEach(key =>
            {
                const match = key.match(/(?:badge_name_(\w+)|(\w+)_badge_name)/i);

                if (match)
                {
                    let badgeName = (match[1] || match[2])?.trim();

                    if (!badgeName || !badgeName.length) return;

                    if (badgeNames.indexOf(badgeName) >= 0) return;

                    badgeNames.push(badgeName);
                }
            });
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return badgeNames;
}
