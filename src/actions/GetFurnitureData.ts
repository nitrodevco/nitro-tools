import { IFurnitureData } from '../core';
import { FetchJson, NitroConfiguration, SaveJson } from '../utils';

let furnitureData: IFurnitureData = null;

export const GetFurnitureData = async () =>
{
    try
    {
        if (!furnitureData)
        {
            furnitureData = await FetchJson<IFurnitureData>({ url: NitroConfiguration.furnitureDataUrl });

            await SaveJson(furnitureData, `./gamedata/FurnitureData.json`)
        }
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }

    return furnitureData;
}
