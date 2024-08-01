import { DownloadAndSaveUntil, NitroConfiguration } from '../utils';

export const DownloadCatalogIcons = async () =>
{
    await DownloadAndSaveUntil({
        url: `${NitroConfiguration.catalogUrl}/icon_%i%.png`,
        destination: `./catalog-icons/icon_%i%.png`
    }, 25);
}
