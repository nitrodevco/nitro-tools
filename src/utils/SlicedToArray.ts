export class SlicedToArray
{
    public static slicedToArray(arr: any, i: number): any[]
    {
        if (Array.isArray(arr))
        {
            return arr.slice(0, i);
        }

        if (Symbol.iterator in Object(arr))
        {
            return this.sliceIterator(arr, i);
        }

        throw new TypeError('Invalid attempt to destructure non-iterable instance');
    }

    private static sliceIterator(iterable: Iterable<any>, limit: number): any[]
    {
        const result = [];
        const iterator = iterable[Symbol.iterator]();

        for (let count = 0; count < limit; count++)
        {
            const { value, done } = iterator.next();
            if (done) break;
            result.push(value);
        }

        return result;
    }
}
