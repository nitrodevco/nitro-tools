
import type { IAssetData } from '../core';
import { AnimationMapper, AssetMapper, IndexMapper, LogicMapper, ManifestMapper, RoomVisualizationMapper, VisualizationMapper } from '../mappers';
import type { SpriteBundle } from '../utils';
import { NitroBundle } from '../utils';
import type { HabboAssetSWF } from './HabboAssetSWF';

export class SWFUtilities {
    public static createNitroBundle(className: string, assetData: IAssetData, spriteBundle: SpriteBundle): NitroBundle {
        const nitroBundle = new NitroBundle();

        if (assetData) {
            if (typeof assetData === 'object') nitroBundle.addFile(`${className}.json`, Buffer.from(JSON.stringify(assetData)));
        }

        if (spriteBundle) {
            if (spriteBundle.imageData) nitroBundle.addFile(`${className}.png`, spriteBundle.imageData);

            if (spriteBundle.spritesheet) {
                if (typeof spriteBundle.spritesheet === 'object') nitroBundle.addFile(`${className}_spritesheet.json`, Buffer.from(JSON.stringify(spriteBundle.spritesheet)));
            }
        }

        return nitroBundle;
    }

    public static async mapXML2JSON(habboAssetSWF: HabboAssetSWF): Promise<IAssetData> {
        if (!habboAssetSWF) return null;

        const output: IAssetData = {};

        const indexXML = await habboAssetSWF.getIndexXML();

        if (indexXML) IndexMapper.mapXML(indexXML, output);

        if (output.type === undefined) output.type = habboAssetSWF.getDocumentClass();

        const manifestXML = await habboAssetSWF.getManifestXML();

        if (manifestXML) ManifestMapper.mapXML(manifestXML, output);

        const animationXML = await habboAssetSWF.getAnimationXML();

        if (animationXML) AnimationMapper.mapXML(animationXML, output);

        let assetXML = await habboAssetSWF.getBinaryDataByClassname(`${habboAssetSWF.getDocumentClass()}_${output.type}_assets`);

        if (!assetXML) assetXML = await habboAssetSWF.getBinaryDataByClassname(`${habboAssetSWF.getDocumentClass()}_${output.type}_room_assets`);

        if (assetXML) AssetMapper.mapXML(assetXML, output);

        const logicXML = await habboAssetSWF.getBinaryDataByClassname(`${habboAssetSWF.getDocumentClass()}_${output.type}_logic`);

        if (logicXML) LogicMapper.mapXML(logicXML, output);

        const visualizationXML = await habboAssetSWF.getBinaryDataByClassname(`${habboAssetSWF.getDocumentClass()}_${output.type}_visualization`);

        if (visualizationXML) VisualizationMapper.mapXML(visualizationXML, output);

        const roomVisualizationXML = await habboAssetSWF.getBinaryDataByClassname(`${habboAssetSWF.getDocumentClass()}_room_visualization`);

        if (roomVisualizationXML) RoomVisualizationMapper.mapXML(visualizationXML, output);

        if (output.palettes !== undefined) {
            for (const paletteId in output.palettes) {
                const palette = output.palettes[paletteId];

                const paletteColors = habboAssetSWF.getPalette(`${output.type}_${palette.source}`);

                if (!paletteColors) {
                    delete output.palettes[paletteId];

                    continue;
                }

                const rgbs: [number, number, number][] = [];

                for (const rgb of paletteColors) rgbs.push([rgb[0], rgb[1], rgb[2]]);

                palette.rgb = rgbs;
            }
        }

        return output;
    }
}
