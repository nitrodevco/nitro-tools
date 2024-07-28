import { DownloadAndSaveMany, NitroConfiguration } from '../utils';
import { GetFigureMap } from './GetFigureMap';

export const DownloadFigureSwfs = async () =>
{
    const figureMap = await GetFigureMap();

    if (!figureMap || !figureMap.libraries || !figureMap.libraries.length) return;

    await DownloadAndSaveMany(figureMap.libraries.map(library =>
    {
        if (library.id === 'hh_pets' || library.id === 'hh_human_fx') return null;

        return {
            url: `${NitroConfiguration.effectUrl}/${library.id}.swf`,
            destination: `./swf/figure/${library.id}.swf`
        }
    }));
}
