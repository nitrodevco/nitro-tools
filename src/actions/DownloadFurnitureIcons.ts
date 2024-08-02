import { DownloadAndSaveMany, NitroConfiguration } from '../utils';
import { GetAllFurniture } from './GetAllFurniture';

export const DownloadFurnitureIcons = async () =>
{
    const allFurniture = await GetAllFurniture();

    if (!allFurniture || !allFurniture.length) return;

    await DownloadAndSaveMany(allFurniture.map(item =>
    {
        return {
            url: `${NitroConfiguration.hofFurniUrl}/${item.revision}/${item.classname.replace('*', '_')}_icon.png`,
            destination: `./furni-icons/${item.classname.replace('*', '_')}_icon.png`
        }
    }));
}
