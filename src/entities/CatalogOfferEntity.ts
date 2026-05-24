import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('catalog_offers')
export class CatalogOfferEntity
{
    @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
    public id: number;

    @Column('int', { name: 'page_id' })
    public pageEntityId: number;

    @Column('varchar', { name: 'localization_id', length: 70 })
    public localizationId: string;

    @Column('int', { name: 'cost_credits', default: '0' })
    public costCredits: number;

    @Column('int', { name: 'cost_currency', default: '0' })
    public costCurrency: number;

    @Column('int', { name: 'currency_type', default: null })
    public currencyType: number;

    @Column('int', { name: 'can_gift', default: '1' })
    public canGift: boolean;

    @Column('int', { name: 'can_bundle', default: '1' })
    public canBundle: boolean;

    @Column('int', { name: 'club_level', default: '0' })
    public clubLevel: number;

    @Column('int', { name: 'visible', default: '1' })
    public visible: boolean;
}
