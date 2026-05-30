import type { IAsset, IAssetAlias, IAssetData, ManifestLibraryAliasXML, ManifestLibraryAssetParamXML, ManifestLibraryAssetXML, ManifestLibraryXML } from '../../core';
import { ManifestXML } from '../../core';

export class ManifestMapper {
    public static mapXML(manifest: any, output: IAssetData): void {
        if (!manifest || !output) return;

        ManifestMapper.mapManifestXML(new ManifestXML(manifest.manifest), output);
    }

    private static mapManifestXML(xml: ManifestXML, output: IAssetData): void {
        if (!xml || !output) return;

        if (xml.library !== undefined) ManifestMapper.mapManifestLibraryXML(xml.library, output);
    }

    private static mapManifestLibraryXML(xml: ManifestLibraryXML, output: IAssetData): void {
        if (!xml || !output) return;

        if (xml.aliases !== undefined) console.log('has aliases', xml.name, xml.aliases);

        if (xml.assets !== undefined) {
            if (xml.assets.length) {
                output.assets = [];

                ManifestMapper.mapManifestLibraryAssetXML(xml.assets, output.assets);
            }
        }

        if (xml.aliases !== undefined) {
            if (xml.aliases.length) {
                output.aliases = [];

                ManifestMapper.mapManifestLibraryAliasXML(xml.aliases, output.aliases);
            }
        }
    }

    private static mapManifestLibraryAssetXML(xml: ManifestLibraryAssetXML[], output: IAsset[]): void {
        if (!xml || !xml.length || !output) return;

        for (const libraryAssetXML of xml) {
            if (libraryAssetXML.mimeType !== 'image/png' || libraryAssetXML.param === undefined) continue;

            const asset: IAsset = {};

            if (libraryAssetXML.name !== undefined) asset.name = libraryAssetXML.name;

            if (libraryAssetXML.param !== undefined) ManifestMapper.mapManifestLibraryAssetParamXML(libraryAssetXML.param, asset);

            output.push(asset);
        }
    }

    private static mapManifestLibraryAssetParamXML(xml: ManifestLibraryAssetParamXML, output: IAsset): void {
        if (!xml || !output) return;

        if (xml.value !== undefined) {
            const split = xml.value.split(',');

            output.x = parseInt(split[0]);
            output.y = parseInt(split[1]);
        }
    }

    private static mapManifestLibraryAliasXML(xml: ManifestLibraryAliasXML[], output: IAssetAlias[]): void {
        if (!xml || !xml.length || !output) return;

        for (const libraryAliasXML of xml) {
            const alias: IAssetAlias = {};

            if (libraryAliasXML.name !== undefined) alias.name = libraryAliasXML.name;
            if (libraryAliasXML.link !== undefined) alias.link = libraryAliasXML.link;
            if (libraryAliasXML.flipH === true) alias.flipH = true;
            if (libraryAliasXML.flipV === true) alias.flipV = true;

            output.push(alias);
        }
    }
}
