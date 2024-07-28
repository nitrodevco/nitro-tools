import { IFigureData } from '../core';
import { FigureDataMapper } from '../mappers';
import { FetchText, NitroConfiguration, ParseXML } from '../utils';

let figureData: IFigureData = null;

export const GetFigureData = async () =>
{
    try
    {
        if (!figureData)
        {
            const xml = await ParseXML(await FetchText(NitroConfiguration.figureDataUrl));

            figureData = {};

            FigureDataMapper.mapXML(xml, figureData);
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return figureData;
}
