import { access, constants } from 'fs/promises';

export const DoesFileExist = async (path: string) =>
{
    try
    {
        await access(path, constants.F_OK);

        return true;
    }

    catch (err)
    {
    }

    return false;
}
