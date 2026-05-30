import { ImageBundle } from '../utils';
import type { HabboAssetSWF } from './HabboAssetSWF';

export const GenerateImageBundle = (habboAssetSWF: HabboAssetSWF) => {
    const documentClass = habboAssetSWF.getDocumentClass();
    const imageBundle = new ImageBundle(documentClass);

    const imageTags = habboAssetSWF.imageTags();
    const tagList = habboAssetSWF.symbolTags();
    const names: string[] = [];
    const tags: number[] = [];

    for (const tag of tagList) {
        names.push(...tag.names);
        tags.push(...tag.tags);
    }

    for (const imageTag of imageTags) imageBundle.addImage(imageTag.className.substring(documentClass.length + 1), imageTag.imgData);

    for (const imageTag of imageTags) {
        if (tags.includes(imageTag.characterId)) {
            for (let i = 0; i < tags.length; i++) {
                if (tags[i] != imageTag.characterId || names[i] == imageTag.className) continue;

                const aliasName = names[i].substring(documentClass.length + 1);
                const className = imageTag.className.substring(documentClass.length + 1);

                if (imageBundle.getImage(className) !== undefined) imageBundle.addSource(aliasName, className);
            }
        }
    }

    return imageBundle;
};
