import { PackerExporter, PackerExporterType } from 'free-tex-packer-core';
import { ImageBundle } from '../utils';
import { HabboAssetSWF } from './HabboAssetSWF';
import { PackImages } from './PackImages';

export const IMAGE_SOURCES: Map<string, string> = new Map();

export const GenerateSpriteSheet = async (habboAssetSWF: HabboAssetSWF, exporter: PackerExporterType | PackerExporter) =>
{
    const tagList = habboAssetSWF.symbolTags();
    const names: string[] = [];
    const tags: number[] = [];

    let documentClass = habboAssetSWF.getDocumentClass();

    if (documentClass === 'HabboRoomContent') documentClass = 'room';

    for (const tag of tagList)
    {
        names.push(...tag.names);
        tags.push(...tag.tags);
    }

    const imageBundle = new ImageBundle();

    const imageTags = habboAssetSWF.imageTags();

    for (const imageTag of imageTags)
    {
        if (tags.includes(imageTag.characterId))
        {
            for (let i = 0; i < tags.length; i++)
            {
                if (tags[i] != imageTag.characterId) continue;

                if (names[i] == imageTag.className) continue;

                if (imageTag.className.startsWith('sh_')) continue;

                if (imageTag.className.indexOf('_32_') >= 0) continue;

                IMAGE_SOURCES.set(names[i].substring(documentClass.length + 1), imageTag.className.substring(documentClass.length + 1));
            }
        }

        if (imageTag.className.startsWith('sh_')) continue;

        if (imageTag.className.indexOf('_32_') >= 0) continue;

        let className = imageTag.className;

        if (className.startsWith('HabboRoomContent')) className = className.replace('HabboRoomContent', 'room');

        imageBundle.addImage(className, imageTag.imgData);
    }

    if (!imageBundle.images.length) return null;

    return await PackImages(imageBundle, {
        textureName: documentClass,
        width: 10240,
        height: 4320,
        fixedSize: false,
        allowRotation: false,
        detectIdentical: true,
        allowTrim: true,
        //@ts-ignore
        exporter: exporter
    });
};
