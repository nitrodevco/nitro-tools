export class CustomIterator<TType>
{
    private idx: number;
    private readonly top: number;
    private readonly keys: Array<string>;
    private readonly isArray: boolean;
    private readonly collection: Array<TType> | { [key: string]: TType };

    constructor(collection: Array<TType> | { [key: string]: TType })
    {
        if (this.isNonIterable(collection))
        {
            throw new Error(`Cannot iterate over the provided collection: ${collection}`);
        }

        this.isArray = Array.isArray(collection);
        this.idx = 0;
        this.top = this.isArray ? collection.length as number : 0;
        this.keys = this.isArray ? [] : Object.keys(collection);
        this.collection = collection;
    }

    private isNonIterable(candidate: any): boolean
    {
        return (
            !candidate ||
            typeof candidate === 'number' ||
            typeof candidate === 'boolean' ||
            (typeof candidate !== 'object' && !Array.isArray(candidate))
        );
    }

    public next(): TType
    {
        if (!this.hasNext())
        {
            throw new Error('No more elements.');
        }

        const elem = this.isArray ? this.collection[this.idx] : this.collection[this.keys[this.idx]];
        this.idx++;
        return elem;
    }

    public hasNext(): boolean
    {
        return this.isArray ? this.idx < this.top : this.idx < this.keys.length;
    }
}
