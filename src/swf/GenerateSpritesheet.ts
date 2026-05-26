import type { PackerExporter, PackerExporterType } from 'free-tex-packer-core';

import type { ImageBundle } from '../utils';
import { PackImages } from './PackImages';

export const GenerateSpriteSheet = async (imageBundle: ImageBundle, exporter: PackerExporterType | PackerExporter) => {
    return await PackImages(imageBundle, {
        textureName: imageBundle.documentClass,
        width: 10240,
        height: 4320,
        fixedSize: false,
        allowRotation: false,
        detectIdentical: true,
        allowTrim: true,
        exporter: exporter
    });
};
