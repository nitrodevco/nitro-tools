import JSZip from 'jszip';

export class NitroBundle
{
    private readonly _files: Map<string, Buffer> = new Map<string, Buffer>();

    public static async from(buffer: ArrayBuffer): Promise<NitroBundle>
    {
        const nitroBundle = new NitroBundle();
        const zip = await JSZip.loadAsync(buffer);

        for (const [fileName, file] of Object.entries(zip.files))
        {
            nitroBundle.addFile(fileName, Buffer.from(await file.async('nodebuffer')));
        }

        return nitroBundle;
    }

    public addFile(name: string, data: Buffer): void
    {
        this._files.set(name, data);
    }

    public async toArrayBufferAsync(): Promise<Buffer>
    {
        const zip = new JSZip();

        for(const file of this._files.entries()) zip.file(file[0], file[1]);

        const arrayBuffer = await zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' });

        return Buffer.from(arrayBuffer);
    }

    public get files(): Map<string, Buffer>
    {
        return this._files;
    }

    public get totalFiles(): number
    {
        return this._files.size;
    }
}
