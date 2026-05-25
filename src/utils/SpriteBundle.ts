import type { ISpritesheetData } from '../core';

export class SpriteBundle {
    private _name: string;
    private _spritesheet: ISpritesheetData;
    private _imageBuffer: Buffer;

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get spritesheet(): ISpritesheetData {
        return this._spritesheet;
    }

    public set spritesheet(spritesheet: ISpritesheetData) {
        this._spritesheet = spritesheet;
    }

    public get imageData(): Buffer {
        return this._imageBuffer;
    }

    public set imageData(imageData: Buffer) {
        this._imageBuffer = imageData;
    }
}
