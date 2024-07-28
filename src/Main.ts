import { DownloadEffectSwfs, DownloadFigureSwfs, DownloadFurnitureSwfs, DownloadPetSwfs, GetEffectMap, GetExternalTexts, GetExternalVariables, GetFigureData, GetFigureMap, GetFlashProduction, GetFurnitureData, GetProductData } from './actions';
import { NitroConfiguration, SaveJson } from './utils';

const bootstrap = async () =>
{
    try
    {
        const production = await GetFlashProduction();

        NitroConfiguration.prod = production;

        const [
            effectMap,
            externalTexts,
            externalVariables,
            figureData,
            figureMap,
            furnitureData,
            productData
        ] = await Promise.all([
            await GetEffectMap(),
            await GetExternalTexts(),
            await GetExternalVariables(),
            await GetFigureData(),
            await GetFigureMap(),
            await GetFurnitureData(),
            await GetProductData()
        ]);

        await Promise.all([
            SaveJson(effectMap, `./gamedata/EffectMap.json`),
            SaveJson(externalTexts, `./gamedata/ExternalTexts.json`),
            SaveJson(externalVariables, `./gamedata/ExternalVariables.json`),
            SaveJson(figureData, `./gamedata/FigureData.json`),
            SaveJson(figureMap, `./gamedata/FigureMap.json`),
            SaveJson(furnitureData, `./gamedata/FurnitureData.json`),
            SaveJson(productData, `./gamedata/ProductData.json`),
        ]);

        await Promise.all([
            DownloadFurnitureSwfs(),
            DownloadPetSwfs(),
            DownloadEffectSwfs(),
            DownloadFigureSwfs()
        ]);
    }

    catch (err)
    {
        console.error(err);
    }
}

bootstrap();
