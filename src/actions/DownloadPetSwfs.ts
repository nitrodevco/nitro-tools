import { DownloadAndSaveMany, NitroConfiguration } from '../utils';
import { GetPetNames } from './GetPetNames';

export const DownloadPetSwfs = async () =>
{
    const petNames = await GetPetNames();

    if (!petNames || !petNames.length) return;

    await DownloadAndSaveMany(petNames.map(petName =>
    {
        return {
            url: `${NitroConfiguration.petUrl}/${petName}.swf`,
            destination: `./swf/pets/${petName}.swf`
        }
    }));
}
