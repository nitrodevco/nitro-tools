import { File } from './File';

export const GetDirectory = async (path: string) =>
{
    const folder = new File(path);

    await folder.createDirectory();

    return folder;
}
