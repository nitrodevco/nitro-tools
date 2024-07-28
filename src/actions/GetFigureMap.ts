import { IFigureMap } from '../core';
import { FigureMapMapper } from '../mappers';
import { FetchText, NitroConfiguration, ParseXML } from '../utils';

let figureMap: IFigureMap = null;

export const GetFigureMap = async () =>
{
    try
    {
        if (!figureMap)
        {
            const xml = await ParseXML(await FetchText(NitroConfiguration.figureMapUrl));

            figureMap = {};

            FigureMapMapper.mapXML(xml, figureMap);
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return figureMap;
}
