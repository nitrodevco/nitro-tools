import type { IFurnitureType } from '../core';

export const GetLogicForType = (furnitureType: IFurnitureType, isWall: boolean = false): string => {
    if (!furnitureType || !furnitureType.category?.length) return isWall ? 'default_wall' : 'default_floor';

    if (furnitureType.classname.startsWith('wf_')) return furnitureType.classname;

    switch (furnitureType.category) {
        case 'gate':
            return 'gate';
        case 'roller':
            return 'roller';
        case 'credit':
            return 'exchange';
        case 'fortuna':
            return 'dice';
        case 'teleport':
            return 'teleport';
        default:
            return isWall ? 'default_wall' : 'default_floor';
    }
};
