export const DoObjectsCompare = (obj1: Object, obj2: Object, path: string = '') =>
{
    if ((typeof obj1 !== typeof obj2) || (typeof obj1 !== 'object' || obj1 === null || obj2 === null)) return false;

    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    for (const key in keys)
    {
        const newPath = path ? `${path}.${key}` : key;

        if (!(key in obj1) || !(key in obj2)) return false;

        if (!DoObjectsCompare(obj1[key], obj2[key], newPath)) return false;
    }

    return true;
}
