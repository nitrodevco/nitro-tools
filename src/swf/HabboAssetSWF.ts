import bytebuffer from 'bytebuffer';
import { parseStringPromise } from 'xml2js';

import type { ITag } from '../core';
import { CustomIterator } from '../utils';
import { ReadImagesDefineBitsLossless } from './ReadImagesDefineBitsLossless';
import { ReadImagesJPEG3or4 } from './ReadImagesJPEG3or4';
import { CharacterTag, DefineBinaryDataTag, ImageTag, SymbolClassTag } from './tags';
import { UncompressSWF } from './UncompressSWF';

export class HabboAssetSWF {
    private readonly _tags: Array<ITag> = [];
    private _documentClass: string | null = null;

    constructor(
        private readonly _data: Buffer
    ) { }

    public async setupAsync() {
        const swf = await UncompressSWF(this._data);

        if (!swf) return;

        for (const tag of swf.tags) {
            switch (tag.header.code) {
                case 76:
                    this._tags.push(new SymbolClassTag(tag.symbols));
                    break;
                case 87:
                    this._tags.push(new DefineBinaryDataTag(tag.data));
                    break;
                case 6:
                    break;
                case 21: {
                    const jpeg3 = await ReadImagesJPEG3or4(21, tag);
                    this._tags.push(new ImageTag(jpeg3.characterId, 21, 'jpeg', jpeg3.imgData));
                    break;
                }
                case 35: {
                    const jpeg3 = await ReadImagesJPEG3or4(35, tag);
                    this._tags.push(new ImageTag(jpeg3.characterId, jpeg3.code, jpeg3.imgType, jpeg3.imgData));
                    break;
                }
                case 36: {
                    const pngTagLossLess2: any = await ReadImagesDefineBitsLossless(tag);
                    this._tags.push(new ImageTag(pngTagLossLess2.characterId, pngTagLossLess2.code, pngTagLossLess2.imgType, pngTagLossLess2.imgData, pngTagLossLess2.bitmapWidth, pngTagLossLess2.bitmapHeight));
                    break;
                }
                case 20: {
                    const pngTagLossless: any = await ReadImagesDefineBitsLossless(tag);
                    this._tags.push(new ImageTag(pngTagLossless.characterId, pngTagLossless.code, pngTagLossless.imgType, pngTagLossless.imgData, pngTagLossless.bitmapWidth, pngTagLossless.bitmapHeight));
                    break;
                }
                default:
                    break;
            }
        }

        this.assignClassesToSymbols();
    }

    public getBinaryTagByName(name: string): DefineBinaryDataTag | null {
        const streamTag = this.binaryTags().filter(tag => tag.className === name)[0];

        if (streamTag === undefined) return null;

        return streamTag;
    }

    public async getBinaryDataByClassname(className: string): Promise<any> {
        const binaryData = this.getBinaryTagByName(className);

        if (!binaryData) return null;

        return await parseStringPromise(this.removeComments(binaryData.binaryData));
    }

    public getFullClassName(type: string, documentNameTwice: boolean, snakeCase: boolean = false): string {
        return this.getFullClassNameSnake(type, documentNameTwice, snakeCase);
    }

    public getFullClassNameSnake(type: string, documentNameTwice: boolean, snakeCase: boolean = false): string {
        let result: string = this.getDocumentClass();

        if (documentNameTwice) {
            if (snakeCase) {
                result = (result + (result.replace(/(?:^|\.?)([A-Z])/g, (x, y) => ('_' + y.toLowerCase().replace(/^_/, '')))) + '_');
            }
            else {
                result += '_' + this.getDocumentClass() + '_';
            }
        }
        else {
            result += '_';
        }

        return result + type;
    }

    public getDocumentClass(): string {
        if (this._documentClass !== null) return this._documentClass;

        const iterator: CustomIterator<ITag> = new CustomIterator(this._tags);


        while (true) {
            let t: ITag;
            do {
                if (!iterator.hasNext()) {
                    return '';
                }

                t = iterator.next();
            } while (!(t instanceof SymbolClassTag));

            const sc = t;

            for (let i = 0; i < sc.tags.length; ++i) {
                if (sc.tags[i] == 0) {
                    this._documentClass = sc.names[i];
                    return this._documentClass;
                }
            }
        }
    }

    public async getIndexXML(): Promise<any> {
        return await this.getBinaryDataByClassname(`${this.getDocumentClass()}_index`);
    }

    public async getManifestXML(): Promise<any> {
        return await this.getBinaryDataByClassname(`${this.getDocumentClass()}_manifest`);
    }

    public async getAnimationXML(): Promise<any> {
        return await this.getBinaryDataByClassname(`${this.getDocumentClass()}_animation`);
    }

    public getPalette(paletteName: string): [number, number, number][] {
        const tag = this.getBinaryTagByName(paletteName);
        const buffer = tag ? bytebuffer.wrap(tag.binaryDataBuffer) : null;
        const paletteColors: [number, number, number][] = []

        if (buffer) {
            let R = 0;
            let G = 0;
            let B = 0;
            let counter = 1;

            while ((tag.binaryDataBuffer.length - buffer.offset) > 0) {
                if (counter == 1) R = buffer.readUint8();

                else if (counter == 2) G = buffer.readUint8();

                else if (counter == 3) {
                    B = buffer.readUint8();

                    paletteColors.push([R, G, B]);

                    counter = 0;
                }

                counter++;
            }
        }

        return paletteColors;
    }

    public imageTags(): Array<ImageTag> {
        return this._tags.filter((tag: ITag) => tag instanceof ImageTag).map(x => x);
    }

    public symbolTags(): Array<SymbolClassTag> {
        return this._tags.filter((tag: ITag) => tag instanceof SymbolClassTag).map(x => x);
    }

    private binaryTags(): Array<DefineBinaryDataTag> {
        return this._tags.filter((tag: ITag) => tag instanceof DefineBinaryDataTag).map(x => x);
    }

    private removeComments(data: string): string {
        return data.replace(/<!--.*?-->/sg, '');
    }

    private assignClassesToSymbols() {
        const classes: Map<number, string> = new Map();

        let iterator: CustomIterator<ITag> = new CustomIterator(this._tags);

        while (true) {
            let t: ITag;

            do {
                if (!iterator.hasNext()) {
                    iterator = new CustomIterator(this._tags);

                    while (iterator.hasNext()) {
                        t = iterator.next();
                        if (t instanceof CharacterTag) {
                            const ct = t as CharacterTag;

                            if (classes.has(ct.characterId)) {
                                ct.className = classes.get(ct.characterId);
                            }
                        }
                    }

                    return;
                }

                t = iterator.next();
            } while (!(t instanceof SymbolClassTag));

            const sct = t;

            for (let i = 0; i < sct.tags.length; ++i) {
                if (!classes.has(sct.tags[i]) && !Array.from(classes.values()).includes(sct.names[i])) {
                    classes.set(sct.tags[i], sct.names[i]);
                }
            }
        }
    }
}
