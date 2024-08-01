import { IProductData } from '../core';
import { FetchJson, NitroConfiguration, SaveJson } from '../utils';

let productData: IProductData = null;

export const GetProductData = async () =>
{
    try
    {
        if (!productData)
        {
            productData = await FetchJson<IProductData>({ url: NitroConfiguration.productDataUrl });

            await SaveJson(productData, `./gamedata/ProductData.json`);
        }
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }

    return productData;
}
