import { ISpritesheetFrame } from './ISpritesheetFrame';
import { ISpritesheetMeta } from './ISpritesheetMeta';

export interface ISpritesheetDataa
{
    meta?: ISpritesheetMeta;
    frames?: { [index: string]: ISpritesheetFrame };
}
