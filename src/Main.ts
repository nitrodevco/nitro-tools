import { CatalogBuilder, ConvertEffectSwfs, ConvertFigureSwfs, ConvertFurnitureSwfs, ConvertPetSwfs, DownloadBadges, DownloadCatalogIcons, DownloadEffectSwfs, DownloadFigureSwfs, DownloadFurnitureIcons, DownloadFurnitureSwfs, DownloadGordon, DownloadPetSwfs, DownloadSounds, GetEffectMap, GetExternalTexts, GetExternalVariables, GetFigureData, GetFigureMap, GetFlashProduction, GetFurnitureData, GetHabboAvatarActions, GetProductData } from './actions';

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

const bootstrap = async () => {
    try {
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

        if (downloadFurniture) promises.push(DownloadFurnitureSwfs());
        if (downloadPets) promises.push(DownloadPetSwfs());
        if (downloadEffects) promises.push(DownloadEffectSwfs());
        if (downloadFigures) promises.push(DownloadFigureSwfs());
        if (downloadBadges) promises.push(DownloadBadges());
        if (downloadSounds) promises.push(DownloadSounds());
        if (downloadCatalogIcons) promises.push(DownloadCatalogIcons());
        if (downloadFurniIcons) promises.push(DownloadFurnitureIcons());
        if (downloadGordon) promises.push(DownloadGordon());

        await Promise.allSettled(promises);

        try {
            await ConvertFigureSwfs();
            await ConvertFurnitureSwfs();
            await ConvertEffectSwfs();
            await ConvertPetSwfs();
        } catch (err) {
            console.error('Error converting swfs', err);
        }

        //await ConvertFigureSwfs();
        //ConvertFurnitureSwfs(),
        //ConvertPetSwfs()

        const catalog = new CatalogBuilder();

        if (buildCatalog) await catalog.init();

        console.log('Finished');

        process.exit(0);
    }

    catch (err) {
        console.error(err);
    }
};

void bootstrap();
