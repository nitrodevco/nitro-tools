import type { TexturePackerOptions } from 'free-tex-packer-core';
import { packAsync } from 'free-tex-packer-core';

import type { ImageBundle } from '../utils';
import { SpriteBundle } from '../utils';

export const PackImages = async (imageBundle: ImageBundle, config?: TexturePackerOptions) => {
    if (!imageBundle) return null;

    const images = await packAsync(Object.keys(imageBundle.images).filter(x => imageBundle.referencedImages.indexOf(x) >= 0).map(x => ({ path: x, contents: imageBundle.images[x] })), config);
    const bundle = new SpriteBundle();

    for (const image of images) {
        bundle.name = image.name;
        bundle.imageData = image.buffer;
    }

    return bundle;
};
