import { ImageBundle } from '../utils';
import type { HabboAssetSWF } from './HabboAssetSWF';

export const GenerateImageBundle = (habboAssetSWF: HabboAssetSWF) => {
    const tagList = habboAssetSWF.symbolTags();
    const names: string[] = [];
    const tags: number[] = [];

    let documentClass = habboAssetSWF.getDocumentClass();

    if (documentClass === 'HabboRoomContent') documentClass = 'room';

    for (const tag of tagList) {
        names.push(...tag.names);
        tags.push(...tag.tags);
    }

    const imageBundle = new ImageBundle(documentClass);
    const imageTags = habboAssetSWF.imageTags();

    for (const imageTag of imageTags) {
        if (tags.includes(imageTag.characterId)) {
            for (let i = 0; i < tags.length; i++) {
                if (tags[i] != imageTag.characterId || names[i] == imageTag.className) continue;

                imageBundle.addSource(names[i].substring(documentClass.length + 1), imageTag.className.substring(documentClass.length + 1));
            }
        }

        let className = imageTag.className;

        if (className.startsWith('HabboRoomContent')) className = className.replace('HabboRoomContent', 'room');

        imageBundle.addImage(className, imageTag.imgData);
    }

    return imageBundle;
};
