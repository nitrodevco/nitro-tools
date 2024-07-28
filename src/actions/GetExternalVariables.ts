import { FetchText, NitroConfiguration } from '../utils';

let externalVariables: { [key: string]: string } = null;

export const GetExternalVariables = async () =>
{
    try
    {
        if (!externalVariables)
        {
            const data = await FetchText(NitroConfiguration.externalVariablesUrl);

            const lines = data.split('\n');

            externalVariables = {};

            for (const line of lines)
            {
                if (line.trim() === '') continue;

                const [key = '', value = ''] = line.split('=');

                externalVariables[key.trim()] = value.trim();
            }
        }
    }

    catch (err)
    {
        console.error(err);
    }

    return externalVariables;
}
