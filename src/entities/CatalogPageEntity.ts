import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('catalog_pages')
export class CatalogPageEntity
{
    @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
    public id: number;

    @Column('int', { name: 'parent_id', default: '0' })
    public parentEntityId: number;

    @Column('varchar', { name: 'localization', length: 70 })
    public localization: string;

    @Column('varchar', { name: 'name', length: 56 })
    public name: string;

    @Column('int', { name: 'icon', default: '0' })
    public icon: number;

    @Column('varchar', { name: 'layout', default: 'default_3x3' })
    public layout: string;

    @Column('varchar', { name: 'image_data', length: 56 })
    public imageData: string;

    @Column('varchar', { name: 'text_data', length: 56 })
    public textData: string;

    @Column('int', { name: 'sort_order', default: '0' })
    public sortOrder: number;

    @Column('int', { name: 'visible', default: '1' })
    public visible: boolean;
}
