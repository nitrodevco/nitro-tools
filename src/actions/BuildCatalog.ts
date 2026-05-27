import { DataSource } from 'typeorm';

import type { IFurnitureType } from '../core';
import { CatalogOfferEntity } from '../entities/CatalogOfferEntity';
import { CatalogPageEntity } from '../entities/CatalogPageEntity';
import { CatalogProductEntity } from '../entities/CatalogProductEntity';
import { FurnitureDefinitionEntity } from '../entities/FurnitureDefinitionEntity';
import { GetAssetForClassName } from './GetAssetForClassName';
import { GetFloorFurniture } from './GetFloorFurniture';
import { GetLogicForType } from './GetLogicForType';
import { GetWallFurniture } from './GetWallFurniture';

export class CatalogBuilder {
    private _processedSpriteIds: Set<number> = new Set();
    private _floorTypes: Map<string, IFurnitureType> = new Map();
    private _wallTypes: Map<string, IFurnitureType> = new Map();
    private _defsByClassName: Map<string, FurnitureDefinitionEntity> = new Map();
    private _pages: Map<string, CatalogPageEntity> = new Map();

    private _dbCtx: DataSource = null;

    public async init(): Promise<void> {
        this._dbCtx = await new DataSource({
            type: 'mysql',
            host: '127.0.0.1',
            port: 3306,
            username: 'root',
            password: 'password',
            database: 'turbonew',
            synchronize: false,
            logging: false,
            entities: [FurnitureDefinitionEntity, CatalogPageEntity, CatalogOfferEntity, CatalogProductEntity]
        }).initialize();

        console.log(`Processing defs...`);
        await this.ProcessFloorItems();
        await this.ProcessWallItems();
        await this._dbCtx.manager.save(Array.from(this._defsByClassName.values()));
        console.log(`Processed defs: ${this._defsByClassName.size}`);

        const root = new CatalogPageEntity();

        root.localization = 'root';
        root.name = null;
        root.icon = 1;
        root.layout = 'default_3x3';
        root.imageData = null;
        root.textData = null;

        await this._dbCtx.manager.save(root);

        const tab = new CatalogPageEntity();

        tab.parentEntityId = root.id;
        tab.localization = 'Furniture';
        tab.name = null;
        tab.icon = 1;
        tab.layout = 'default_3x3';
        tab.imageData = null;
        tab.textData = null;

        await this._dbCtx.manager.save(tab);

        console.log(`Processing floor...`);
        const floorDefs = Array.from(this._defsByClassName.values()).filter(def => def.type === 0).sort((a, b) => a.spriteId - b.spriteId);

        for (const floorDef of floorDefs) {
            const itemType = this._floorTypes.get(floorDef.name);

            if (!itemType) continue;

            const page = await this.GetCatalogPageForType(itemType, tab.id);

            if (!page) continue;

            const offer = await this.GetCatalogOffer(page, floorDef);
            const product = new CatalogProductEntity();

            product.offerEntityId = offer.id;
            product.productType = 0;
            product.definitionEntityId = floorDef.id;
            product.extraParam = null;
            product.quantity = 1;
            product.uniqueSize = 0;
            product.uniqueRemaining = 0;

            await this._dbCtx.manager.save(product);
        }
        console.log(`Processed floor: ${floorDefs.length}`);

        console.log(`Processing wall...`);
        const wallDefs = Array.from(this._defsByClassName.values()).filter(def => def.type === 1).sort((a, b) => a.spriteId - b.spriteId);

        for (const wallDef of wallDefs) {
            const itemType = this._wallTypes.get(wallDef.name);

            if (!itemType) continue;

            const page = await this.GetCatalogPageForType(itemType, tab.id);

            if (!page) continue;

            const offer = await this.GetCatalogOffer(page, wallDef);
            const product = new CatalogProductEntity();

            product.offerEntityId = offer.id;
            product.productType = 1;
            product.definitionEntityId = wallDef.id;
            product.extraParam = null;
            product.quantity = 1;
            product.uniqueSize = 0;
            product.uniqueRemaining = 0;

            await this._dbCtx.manager.save(product);
        }
        console.log(`Processed wall: ${wallDefs.length}`);
    }

    private async ProcessFloorItems(): Promise<void> {
        const items = await GetFloorFurniture();

        if (!items || !items.length) return;

        for (const item of items) await this.ProcessItem(item, false);
    };

    private async ProcessWallItems(): Promise<void> {
        const items = await GetWallFurniture();

        if (!items || !items.length) return;

        for (const item of items) await this.ProcessItem(item, true);
    };

    private async ProcessItem(item: IFurnitureType, isWall: boolean = false): Promise<void> {
        try {
            if (this._processedSpriteIds.has(item.id)) return;

            const assetData = await GetAssetForClassName(item.classname.split('*')[0]);

            if (!assetData) return;

            let totalStates = 0;

            const visualization = assetData.visualizations?.find(visualization => (visualization.size === 64));

            if (visualization && visualization.animations) {
                for (const key of Object.keys(visualization.animations)) {
                    const animation = visualization.animations[key];

                    if (!animation || animation.transitionTo || animation.transitionFrom) continue;

                    totalStates++;
                }
            }

            const entity = new FurnitureDefinitionEntity();

            let canWalk = item.canstandon ?? false;
            const canSit = item.cansiton ?? false;
            const canLay = item.canlayon ?? false;

            if (canSit || canLay) canWalk = true;

            entity.spriteId = item.id;
            entity.name = item.classname;
            entity.type = isWall ? 1 : 0;
            entity.category = 1;
            entity.logic = GetLogicForType(item, isWall);
            entity.totalStates = totalStates;
            entity.width = assetData.logic?.model?.dimensions?.x ?? 0;
            entity.length = assetData.logic?.model?.dimensions?.y ?? 0;
            entity.z = assetData.logic?.model?.dimensions?.z ?? 0;
            entity.canStack = isWall ? false : (entity.z > 0);
            entity.canWalk = isWall ? false : canWalk;
            entity.canSit = isWall ? false : canSit;
            entity.canLay = isWall ? false : canLay;

            this._defsByClassName.set(entity.name, entity);
            this._processedSpriteIds.add(entity.spriteId);

            if (isWall) this._wallTypes.set(entity.name, item);
            else this._floorTypes.set(entity.name, item);
        }
        catch (error) {
            console.error(`Failed to process furniture definition for "${item.classname}": ${error?.message ?? error}`);
            return;
        }
    }

    private async GetCatalogPageForType(furnitureType: IFurnitureType, parentId: number = null): Promise<CatalogPageEntity> {
        if (!furnitureType) return;

        if (furnitureType.classname.startsWith('wf_')) {
            const parent = await this.CreatePage('wired', parentId);

            let pageName = "Wired";

            if (furnitureType.classname.startsWith('wf_act_')) pageName = "Wired Actions";
            else if (furnitureType.classname.startsWith('wf_cnd_')) pageName = "Wired Conditions";
            else if (furnitureType.classname.startsWith('wf_slc_')) pageName = "Wired Selectors";
            else if (furnitureType.classname.startsWith('wf_trg_')) pageName = "Wired Triggers";
            else if (furnitureType.classname.startsWith('wf_var_')) pageName = "Wired Variables";
            else if (furnitureType.classname.startsWith('wf_xtra_')) pageName = "Wired Extras";
            else pageName = "Other";

            return await this.CreatePage(pageName, parent.id);
        }

        let [furniLine, year] = furnitureType.furniline?.split('_') ?? ['default', null];
        const [name, color] = furnitureType.classname.split('*') ?? [null, null];

        if (!furniLine || !furniLine.length) furniLine = 'default';

        const parentPage = await this.CreatePage(furniLine, parentId);

        //@ts-ignore
        /* if (year && year.length && !isNaN(year))
        {
            parentPage = await this.CreatePage(`${furniLine}:${year}`, parentPage.id);
        }

        if (color && color.length)
        {
            return await this.CreatePage(`${furniLine}:${color}`, parentPage.id);
        } */

        return parentPage;
    }

    private async CreatePage(pageName: string, parentId: number = null): Promise<CatalogPageEntity> {
        let entity = this._pages.get(pageName);

        if (!entity) {
            entity = new CatalogPageEntity();

            entity.parentEntityId = parentId;
            entity.localization = pageName;
            entity.name = null;
            entity.icon = 1;
            entity.layout = 'default_3x3';
            entity.imageData = null;
            entity.textData = null;

            this._pages.set(pageName, entity);

            await this._dbCtx.manager.save(entity);
        }

        return entity;
    }

    private async GetCatalogOffer(catalogPage: CatalogPageEntity, definition: FurnitureDefinitionEntity) {
        const entity = new CatalogOfferEntity();

        entity.pageEntityId = catalogPage.id;
        entity.localizationId = definition.name;
        entity.costCredits = 0;
        entity.costCurrency = 0;
        entity.currencyType = null;
        entity.canGift = true;
        entity.canBundle = true;
        entity.clubLevel = 0;
        entity.visible = true;

        await this._dbCtx.manager.save(entity);

        return entity;
    }
}
