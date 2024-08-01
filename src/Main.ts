import { DownloadBadges, DownloadCatalogIcons, DownloadEffectSwfs, DownloadFigureSwfs, DownloadFurnitureSwfs, DownloadGordon, DownloadPetSwfs, DownloadSounds, GetEffectMap, GetExternalTexts, GetExternalVariables, GetFigureData, GetFigureMap, GetFlashProduction, GetFurnitureData, GetHabboAvatarActions, GetProductData } from './actions';

let saveJSON = true;
let downloadFurniture = false;
let downloadPets = false;
let downloadEffects = false;
let downloadFigures = false;
let downloadBadges = false;
let downloadSounds = false;
let downloadCatalogIcons = false;
let downloadGordon = true;

const bootstrap = async () =>
{
    try
    {
        await Promise.allSettled([
            await GetFlashProduction(),
            await GetEffectMap(),
            await GetExternalTexts(),
            await GetExternalVariables(),
            await GetFigureData(),
            await GetFigureMap(),
            await GetFurnitureData(),
            await GetProductData(),
            await GetHabboAvatarActions()
        ]);

        const promises: Promise<void>[] = [];

        downloadFurniture && promises.push(DownloadFurnitureSwfs());
        downloadPets && promises.push(DownloadPetSwfs());
        downloadEffects && promises.push(DownloadEffectSwfs());
        downloadFigures && promises.push(DownloadFigureSwfs());
        downloadBadges && promises.push(DownloadBadges());
        downloadSounds && promises.push(DownloadSounds());
        downloadCatalogIcons && promises.push(DownloadCatalogIcons());
        downloadGordon && promises.push(DownloadGordon());

        await Promise.allSettled(promises);

        process.exit(0);
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }
}

bootstrap();
