import type { TexturePackerOptions } from 'free-tex-packer-core';
import { packAsync } from 'free-tex-packer-core';

import type { ImageBundle } from '../utils';
import { SpriteBundle } from '../utils';

export const PackImages = async (imageBundle: ImageBundle, config?: TexturePackerOptions) => {
    if (!imageBundle) return null;

    const images = Object.keys(imageBundle.images).filter(x => imageBundle.referencedImages.indexOf(x) >= 0).map(x => ({ path: x, contents: imageBundle.images[x] }));

    if (!images || !images.length) return null;

    const files = await packAsync(images, config);
    const bundle = new SpriteBundle();

    for (const file of files) {

        if (file.name.endsWith('.json')) {
            bundle.spritesheet = JSON.parse(file.buffer.toString('utf8'));

            delete bundle.spritesheet.meta.app;
            delete bundle.spritesheet.meta.version;

            continue;
        }

        if (file.name.endsWith('.png')) {
            bundle.name = file.name;
            bundle.imageData = file.buffer;
        }
    }

    return bundle;
};
