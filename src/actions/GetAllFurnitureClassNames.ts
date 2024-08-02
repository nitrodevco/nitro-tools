import { GetAllFurniture } from './GetAllFurniture';

export const GetAllFurnitureClassNames = async () =>
{
    const allFurniture = await GetAllFurniture();
    const classNames: string[] = [];

    if (allFurniture && allFurniture.length)
    {
        for (const furniture of allFurniture)
        {
            if (!furniture || !furniture.classname) continue;

            const className = furniture.classname.split('*')[0];

            if (classNames.indexOf(className) === -1) classNames.push(className);
        }
    }

    return classNames;
}
