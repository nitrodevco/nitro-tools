import { IFigureData } from '../core';
import { FigureDataMapper } from '../mappers';
import { FetchText, NitroConfiguration, ParseXML, SaveJson } from '../utils';

let figureData: IFigureData = null;

export const GetFigureData = async () =>
{
    try
    {
        if (!figureData)
        {
            const xml = await ParseXML(await FetchText({ url: NitroConfiguration.figureDataUrl }));

            figureData = {};

            FigureDataMapper.mapXML(xml, figureData);

            await SaveJson(figureData, `./gamedata/FigureData.json`)
        }
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }

    return figureData;
}
