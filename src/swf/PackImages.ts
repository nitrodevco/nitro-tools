import type { TexturePackerOptions } from 'free-tex-packer-core';
import { packAsync } from 'free-tex-packer-core';

import type { ImageBundle } from '../utils';
import { SpriteBundle } from '../utils';

export const PackImages = async (imageBundle: ImageBundle, config?: TexturePackerOptions) => {
    const files = await packAsync(imageBundle.images, config);
    const bundle = new SpriteBundle();

    for (const item of files) {
        if (item.name.endsWith('.json')) {
            bundle.spritesheet = JSON.parse(item.buffer.toString('utf8'));

            delete bundle.spritesheet.meta.app;
            delete bundle.spritesheet.meta.version;

            continue;
        }

        if (item.name.endsWith('.png')) {
            bundle.name = item.name;
            bundle.imageData = item.buffer;
        }
    }

    return bundle;
};
