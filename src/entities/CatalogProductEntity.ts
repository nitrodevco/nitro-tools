import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('catalog_products')
export class CatalogProductEntity
{
    @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
    public id: number;

    @Column('int', { name: 'offer_id' })
    public offerEntityId: number;

    @Column('int', { name: 'product_type' })
    public productType: number;

    @Column('int', { name: 'definition_id', default: null })
    public definitionEntityId: number;

    @Column('varchar', { name: 'extra_param', length: 56 })
    public extraParam: string;

    @Column('int', { name: 'quantity', default: '1' })
    public quantity: number;

    @Column('int', { name: 'unique_size', default: '0' })
    public uniqueSize: number;

    @Column('int', { name: 'unique_remaining', default: '0' })
    public uniqueRemaining: number;
}
