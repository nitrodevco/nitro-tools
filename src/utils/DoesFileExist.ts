import { access, constants } from 'fs/promises';

export const DoesFileExist = async (path: string) => {
    try {
        await access(path, constants.F_OK);

        return true;
    }

    catch (err) {
        console.error(err?.message ?? err);
    }

    return false;
};
