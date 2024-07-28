export class NitroConfiguration
{
    public static domain: string = 'com';
    public static useRevision: boolean = false;
    public static prod: string = '';
    public static outputPath: string = './output';

    public static get gordonUrl(): string
    {
        return `https://images.habbo.${NitroConfiguration.domain}/gordon/flash-assets-${NitroConfiguration.prod}`;
    }

    public static get effectMapUrl(): string
    {
        return `${NitroConfiguration.gordonUrl}/effectmap.xml`;
    }

    public static get externalTextsUrl(): string
    {
        return `https://www.habbo.${NitroConfiguration.domain}/gamedata/external_flash_texts/0`;
    }

    public static get externalVariablesUrl(): string
    {
        return `https://www.habbo.${NitroConfiguration.domain}/gamedata/external_variables/0`;
    }

    public static get figureDataUrl(): string
    {
        return `https://www.habbo.${NitroConfiguration.domain}/gamedata/figuredata/0`;
    }

    public static get figureMapUrl(): string
    {
        return `${NitroConfiguration.gordonUrl}/figuremap.xml`;
    }

    public static get furnitureDataUrl(): string
    {
        return `https://www.habbo.${NitroConfiguration.domain}/gamedata/furnidata_json/0`;
    }

    public static get productDataUrl(): string
    {
        return `https://www.habbo.${NitroConfiguration.domain}/gamedata/productdata_json/0`
    }

    public static get hofFurniUrl(): string
    {
        return `https://images.habbo.${NitroConfiguration.domain}/dcr/hof_furni`;
    }

    public static get petUrl(): string
    {
        return NitroConfiguration.gordonUrl;
    }

    public static get effectUrl(): string
    {
        return NitroConfiguration.gordonUrl;
    }
}
