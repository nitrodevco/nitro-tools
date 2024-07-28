import { DownloadAndSaveMany, NitroConfiguration } from '../utils';
import { GetAllFurniture } from './GetAllFurniture';

export const DownloadFurnitureSwfs = async () =>
{
    const allFurniture = await GetAllFurniture();

    if (!allFurniture || !allFurniture.length) return;

    await DownloadAndSaveMany(allFurniture.map(item =>
    {
        return {
            url: `${NitroConfiguration.hofFurniUrl}/${item.revision}/${item.classname.split('*')[0]}.swf`,
            destination: `./swf/furniture/${item.classname.split('*')[0]}.swf`
        }
    }));
}
