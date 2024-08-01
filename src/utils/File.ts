import { existsSync } from 'fs';
import { lstat, mkdir, readdir, readFile, writeFile } from 'fs/promises';

export class File
{
    constructor(private readonly _path: string)
    { }

    public async createDirectory(): Promise<boolean>
    {
        try
        {
            await mkdir(this._path, { recursive: true });

            return true;
        }

        catch (err)
        {
            if (err.code && (err.code === 'EEXISTS')) return true;

            console.error(err?.message ?? err);

            return false;
        }
    }

    public exists(): boolean
    {
        if (existsSync(this._path)) return true;

        return false;
    }

    public async getFileList(): Promise<string[]>
    {
        try
        {
            return await readdir(this._path);
        }

        catch (err)
        {
            console.error(err?.message ?? err);

            return null;
        }
    }

    public async isDirectory(): Promise<boolean>
    {
        try
        {
            return (await lstat(this._path)).isDirectory();
        }

        catch (err)
        {
            console.error(err?.message ?? err);

            return false;
        }
    }

    public async getContentsAsBuffer(): Promise<Buffer>
    {
        try
        {
            return await readFile(this._path);
        }

        catch (err)
        {
            console.error(err?.message ?? err);

            return null;
        }
    }

    public async writeData(data: string | Uint8Array): Promise<boolean>
    {
        try
        {
            await writeFile(this._path, data);

            return true;
        }

        catch (err)
        {
            console.error(err?.message ?? err);

            return false;
        }
    }

    public get path(): string
    {
        return this._path;
    }
}
