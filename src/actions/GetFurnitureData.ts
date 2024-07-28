import { IFurnitureData } from '../core';
import { FetchJson, NitroConfiguration } from '../utils';

let furnitureData: IFurnitureData = null;

export const GetFurnitureData = async () =>
{
    try
    {
        if (!furnitureData)
        {
            furnitureData = await FetchJson<IFurnitureData>(NitroConfiguration.furnitureDataUrl);
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return furnitureData;
}
