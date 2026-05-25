import type { ISWFFileAttributes } from './ISWFFileAttributes';
import type { ISWFFileLength } from './ISWFFileLength';
import type { ISWFFrameSize } from './ISWFFrameSize';
import type { ISWFTag } from './ISWFTag';

export interface ISWF {
    version?: number;
    fileLength?: ISWFFileLength;
    frameSize?: ISWFFrameSize;
    frameRate?: number;
    frameCount?: number;
    backgroundColor?: string;
    fileAttributes?: Partial<ISWFFileAttributes>;
    metadata?: string;
    protect?: string;
    tags?: Partial<ISWFTag>[];
}
