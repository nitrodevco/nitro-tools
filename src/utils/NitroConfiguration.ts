export class NitroConfiguration {
    public static DOMAIN: string = 'com';
    public static USE_REVISION: boolean = false;
    public static REVISION: string = '';
    public static OUTPUT_PATH: string = './output';
    public static CONVERT_SMALL_ASSETS: boolean = false;
    public static SKIP_CONVERTED_ASSETS: boolean = true;
    public static BATCH_SIZE: number = 5;

    public static get habboGordonUrl(): string {
        return `https://images.habbo.${NitroConfiguration.DOMAIN}/gordon/flash-assets-${NitroConfiguration.REVISION}`;
    }

    public static get alternateGordonUrl(): string {
        return 'https://assets.nitrodev.co/swf/gordon';
    }

    public static get gordonUrl(): string {
        return NitroConfiguration.habboGordonUrl;
    }

    public static get effectMapUrl(): string {
        return `${NitroConfiguration.gordonUrl}/effectmap.xml`;
    }

    public static get externalTextsUrl(): string {
        return `https://www.habbo.${NitroConfiguration.DOMAIN}/gamedata/external_flash_texts/0`;
    }

    public static get externalVariablesUrl(): string {
        return `https://www.habbo.${NitroConfiguration.DOMAIN}/gamedata/external_variables/0`;
    }

    public static get figureDataUrl(): string {
        return `https://www.habbo.${NitroConfiguration.DOMAIN}/gamedata/figuredata/0`;
    }

    public static get figureMapUrl(): string {
        return `${NitroConfiguration.gordonUrl}/figuremap.xml`;
    }

    public static get furnitureDataUrl(): string {
        return `https://www.habbo.${NitroConfiguration.DOMAIN}/gamedata/furnidata_json/0`;
    }

    public static get productDataUrl(): string {
        return `https://www.habbo.${NitroConfiguration.DOMAIN}/gamedata/productdata_json/0`;
    }

    public static get habboAvatarActionsUrl(): string {
        return `${NitroConfiguration.gordonUrl}/HabboAvatarActions.xml`;
    }

    public static get hofFurniUrl(): string {
        return `https://images.habbo.${NitroConfiguration.DOMAIN}/dcr/hof_furni`;
    }

    public static get petUrl(): string {
        return NitroConfiguration.gordonUrl;
    }

    public static get effectUrl(): string {
        return NitroConfiguration.gordonUrl;
    }

    public static get badgeUrl(): string {
        return `https://images.habbo.${NitroConfiguration.DOMAIN}/c_images/album1584`;
    }

    public static get soundUrl(): string {
        return `${NitroConfiguration.hofFurniUrl}/mp3`;
    }

    public static get catalogUrl(): string {
        return `https://images.habbo.${NitroConfiguration.DOMAIN}/c_images/catalogue`;
    }
}
