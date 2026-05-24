import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('furniture_definitions')
export class FurnitureDefinitionEntity
{
    @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
    public id: number;

    @Column('int', { name: 'sprite_id', default: '0' })
    public spriteId: number;

    @Column('varchar', { name: 'name', length: 56 })
    public name: string;

    @Column('int', { name: 'type', default: '0' })
    public type: number;

    @Column('int', { name: 'category', default: '1' })
    public category: number;

    @Column('varchar', { name: 'logic', length: 500, default: 'default' })
    public logic: string;

    @Column('int', { name: 'total_states', default: '1' })
    public totalStates: number;

    @Column('int', { name: 'width', default: '1' })
    public width: number;

    @Column('int', { name: 'length', default: '1' })
    public length: number;

    @Column('double', { name: 'stack_height', precision: 10, scale: 3, default: '0.000' })
    public z: number;

    @Column('tinyint', { name: 'can_stack', width: 1, default: '1' })
    public canStack: boolean;

    @Column('tinyint', { name: 'can_walk', width: 1, default: '0' })
    public canWalk: boolean;

    @Column('tinyint', { name: 'can_sit', width: 1, default: '0' })
    public canSit: boolean;

    @Column('tinyint', { name: 'can_lay', width: 1, default: '0' })
    public canLay: boolean;

    @Column('tinyint', { name: 'can_recycle', width: 1, default: '0' })
    public canRecycle: boolean;

    @Column('tinyint', { name: 'can_trade', width: 1, default: '1' })
    public canTrade: boolean;

    @Column('tinyint', { name: 'can_group', width: 1, default: '1' })
    public canGroup: boolean;

    @Column('tinyint', { name: 'can_sell', width: 1, default: '0' })
    public canSell: boolean;

    @Column('int', { name: 'usage_policy', default: '1' })
    public useagePolicy: number;

    @Column('varchar', { name: 'extra_data', length: 256 })
    public extraData: string;
}
