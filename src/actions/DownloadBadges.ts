import { DownloadAndSaveMany, NitroConfiguration } from '../utils';
import { GetBadgeNames } from './GetBadgeNames';

export const DownloadBadges = async () =>
{
    const badgeNames = await GetBadgeNames();

    if (!badgeNames || !badgeNames.length) return;

    await DownloadAndSaveMany(badgeNames.map(badgeName =>
    {
        return {
            url: `${NitroConfiguration.badgeUrl}/${badgeName}.gif`,
            destination: `./badges/${badgeName}.gif`
        }
    }));
}
