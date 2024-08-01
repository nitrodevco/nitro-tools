import { IFigureMap } from '../core';
import { FigureMapMapper } from '../mappers';
import { FetchText, NitroConfiguration, ParseXML, SaveJson } from '../utils';

let figureMap: IFigureMap = null;

export const GetFigureMap = async () =>
{
    try
    {
        if (!figureMap)
        {
            const xml = await ParseXML(await FetchText({ url: NitroConfiguration.figureMapUrl }));

            figureMap = {};

            FigureMapMapper.mapXML(xml, figureMap);

            await SaveJson(figureMap, `./gamedata/FigureMap.json`)
        }
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }

    return figureMap;
}
