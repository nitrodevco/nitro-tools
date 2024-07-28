import { GetExternalVariables } from './GetExternalVariables';

export const GetFlashProduction = async () =>
{
    const externalVariables = await GetExternalVariables();

    const flashClientUrl = externalVariables['flash.client.url'];

    let production: string = '';

    if (flashClientUrl && flashClientUrl.length)
    {
        production = flashClientUrl.match(/flash-assets-([^/]+)/)?.[1] ?? '';
    }

    return production;
}
