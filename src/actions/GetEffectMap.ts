import { IEffectMap } from '../core';
import { EffectMapMapper } from '../mappers';
import { FetchText, NitroConfiguration, ParseXML, SaveJson } from '../utils';

let effectMap: IEffectMap = null;

export const GetEffectMap = async () =>
{
    try
    {
        if (!effectMap)
        {
            const xml = await ParseXML(await FetchText({ url: NitroConfiguration.effectMapUrl }));

            effectMap = {};

            EffectMapMapper.mapXML(xml, effectMap);

            await SaveJson(effectMap, `./gamedata/EffectMap.json`)
        }
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }

    return effectMap;
}
