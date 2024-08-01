import { FetchText, NitroConfiguration, SaveJson } from '../utils';

let externalTexts: { [key: string]: string } = null;

export const GetExternalTexts = async () =>
{
    try
    {
        if (!externalTexts)
        {
            const data = await FetchText({ url: NitroConfiguration.externalTextsUrl });

            const lines = data.split('\n');

            externalTexts = {};

            for (const line of lines)
            {
                if (line.trim() === '') continue;

                const [key = '', value = ''] = line.split('=');

                externalTexts[key.trim()] = value.trim();
            }

            await SaveJson(externalTexts, `./gamedata/ExternalTexts.json`)
        }
    }

    catch (err)
    {
        console.error(err?.message ?? err);
    }

    return externalTexts;
}
