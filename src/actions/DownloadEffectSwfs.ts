import { DownloadAndSaveMany, NitroConfiguration } from '../utils';
import { GetEffectMap } from './GetEffectMap';

export const DownloadEffectSwfs = async () =>
{
    const effectMap = await GetEffectMap();

    if (!effectMap || !effectMap.effects || !effectMap.effects.length) return;

    await DownloadAndSaveMany(effectMap.effects.map(effect =>
    {
        return {
            url: `${NitroConfiguration.effectUrl}/${effect.lib}.swf`,
            destination: `./swf/effects/${effect.lib}.swf`
        }
    }));
}
