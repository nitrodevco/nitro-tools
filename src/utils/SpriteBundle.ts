import { ISpritesheetDataa } from '../core';

export class SpriteBundle
{
    private _name: string;
    private _spritesheet: ISpritesheetDataa;
    private _imageBuffer: Buffer;

    public get name(): string
    {
        return this._name;
    }

    public set name(name: string)
    {
        this._name = name;
    }

    public get spritesheet(): ISpritesheetDataa
    {
        return this._spritesheet;
    }

    public set spritesheet(spritesheet: ISpritesheetDataa)
    {
        this._spritesheet = spritesheet;
    }

    public get imageData(): Buffer
    {
        return this._imageBuffer;
    }

    public set imageData(imageData: Buffer)
    {
        this._imageBuffer = imageData;
    }
}
