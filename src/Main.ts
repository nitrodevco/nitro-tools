import { ConvertEffectSwfs, ConvertFigureSwfs, ConvertFurnitureSwfs, ConvertPetSwfs, DownloadBadges, DownloadCatalogIcons, DownloadEffectSwfs, DownloadFigureSwfs, DownloadFurnitureIcons, DownloadFurnitureSwfs, DownloadGordon, DownloadPetSwfs, DownloadSounds, GetEffectMap, GetExternalTexts, GetExternalVariables, GetFigureData, GetFigureMap, GetFlashProduction, GetFurnitureData, GetHabboAvatarActions, GetProductData } from './actions';

let downloadFurniture = true;
let downloadPets = true;
let downloadEffects = true;
let downloadFigures = true;
let downloadBadges = true;
let downloadSounds = true;
let downloadCatalogIcons = true;
let downloadFurniIcons = true;
let downloadGordon = true;

const bootstrap = async () =>
{
    try
    {
        await GetFlashProduction();

        await Promise.allSettled([
            GetEffectMap(),
            GetExternalTexts(),
            GetExternalVariables(),
            GetFigureData(),
            GetFigureMap(),
            GetFurnitureData(),
            GetProductData(),
            GetHabboAvatarActions()
        ]);

        const promises: Promise<void>[] = [];

        downloadFurniture && promises.push(DownloadFurnitureSwfs());
        downloadPets && promises.push(DownloadPetSwfs());
        downloadEffects && promises.push(DownloadEffectSwfs());
        downloadFigures && promises.push(DownloadFigureSwfs());
        downloadBadges && promises.push(DownloadBadges());
        downloadSounds && promises.push(DownloadSounds());
        downloadCatalogIcons && promises.push(DownloadCatalogIcons());
        downloadFurniIcons && promises.push(DownloadFurnitureIcons());
        downloadGordon && promises.push(DownloadGordon());

        await Promise.allSettled(promises);

        await Promise.allSettled([
            ConvertEffectSwfs(),
            ConvertFigureSwfs(),
            ConvertFurnitureSwfs(),
            ConvertPetSwfs()
        ]);

        console.log('Finished');

        process.exit(0);
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }
}

bootstrap();
