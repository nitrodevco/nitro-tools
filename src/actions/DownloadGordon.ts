import { IFetchItem } from '../core';
import { DownloadAndSaveMany, NitroConfiguration } from '../utils';

const gordonFileNames = ['HabboRoomContent.swf', 'PlaceHolderFurniture.swf', 'PlaceHolderPet.swf', 'PlaceHolderWallItem.swf', 'SelectionArrow.swf', 'TileCursor.swf'];

export const DownloadGordon = async () =>
{

    await DownloadAndSaveMany([
        ...gordonFileNames.map(fileName =>
        {
            return {
                url: `${NitroConfiguration.alternateGordonUrl}/${fileName}`,
                alternateUrl: `${NitroConfiguration.gordonUrl}/${fileName}`,
                destination: `./swf/gordon/${fileName}`
            } as IFetchItem;
        })
    ]);
}
