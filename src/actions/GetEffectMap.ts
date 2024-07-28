import { IEffectMap } from '../core';
import { EffectMapMapper } from '../mappers';
import { FetchText, NitroConfiguration, ParseXML } from '../utils';

let effectMap: IEffectMap = null;

export const GetEffectMap = async () =>
{
    try
    {
        if (!effectMap)
        {
            const xml = await ParseXML(await FetchText(NitroConfiguration.effectMapUrl));

            effectMap = {};

            EffectMapMapper.mapXML(xml, effectMap);
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return effectMap;
}
