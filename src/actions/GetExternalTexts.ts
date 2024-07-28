import { FetchText, NitroConfiguration } from '../utils';

let externalTexts: { [key: string]: string } = null;

export const GetExternalTexts = async () =>
{
    try
    {
        if (!externalTexts)
        {
            const data = await FetchText(NitroConfiguration.externalTextsUrl);

            const lines = data.split('\n');

            externalTexts = {};

            for (const line of lines)
            {
                if (line.trim() === '') continue;

                const [key = '', value = ''] = line.split('=');

                externalTexts[key.trim()] = value.trim();
            }
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return externalTexts;
}
