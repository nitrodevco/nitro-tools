import config from 'config';
import { CatalogBuilder, ConvertFurnitureSwfs, DownloadBadges, DownloadCatalogIcons, DownloadEffectSwfs, DownloadFigureSwfs, DownloadFurnitureIcons, DownloadFurnitureSwfs, DownloadGordon, DownloadPetSwfs, DownloadSounds, GetEffectMap, GetExternalTexts, GetExternalVariables, GetFigureData, GetFigureMap, GetFlashProduction, GetFurnitureData, GetHabboAvatarActions, GetProductData } from './actions';

const downloadFurniture = false;
const downloadPets = false;
const downloadEffects = false;
const downloadFigures = false;
const downloadBadges = false;
const downloadSounds = false;
const downloadCatalogIcons = false;
const downloadFurniIcons = false;
const downloadGordon = false;
const buildCatalog = false;

const bootstrap = async () =>
{
    console.log(config);

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
            //ConvertEffectSwfs(),
            //ConvertFigureSwfs(),
            ConvertFurnitureSwfs(),
            //ConvertPetSwfs()
        ]);

        const catalog = new CatalogBuilder();

        buildCatalog && await catalog.init();

        console.log('Finished');

        process.exit(0);
    }

    catch (err)
    {
        console.error(err);
    }
};

bootstrap();
