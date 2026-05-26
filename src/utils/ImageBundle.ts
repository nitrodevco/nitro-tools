export class ImageBundle {
    private _images: { [index: string]: Buffer } = {};
    private _sources: { [index: string]: string } = {};
    private _referencedImages: string[] = [];

    constructor(private _documentClass: string = '') { }

    public dispose(): void {
        this._images = null;
        this._sources = null;
    }

    public getImage(path: string): Buffer {
        return this._images[`${this._documentClass}_${path}`];
    }

    public addImage(path: string, contents: Buffer): void {
        if (!path || !contents) return;

        this._images[path] = contents;
    }

    public addImageReference(path: string): void {
        if (!path) return;

        path = `${this._documentClass}_${path}`;

        if (this._images[path] !== undefined && !this._referencedImages.includes(path)) this._referencedImages.push(path);
    }

    public addSource(aliasName: string, bitmapName: string): void {
        if (!aliasName || !bitmapName) return;

        this._sources[aliasName] = bitmapName;
    }

    public get documentClass(): string {
        return this._documentClass;
    }

    public get images(): { [index: string]: Buffer } {
        return this._images;
    }

    public get sources(): { [index: string]: string } {
        return this._sources;
    }

    public get referencedImages(): string[] {
        return this._referencedImages;
    }
}
