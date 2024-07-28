import { IProductData } from '../core';
import { FetchJson, NitroConfiguration } from '../utils';

let productData: IProductData = null;

export const GetProductData = async () =>
{
    try
    {
        if (!productData)
        {
            productData = await FetchJson<IProductData>(NitroConfiguration.productDataUrl);
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return productData;
}
