import { State, Collection } from '../internal'

type PrimaryKey = string | number

export class Group<DataType> extends State<PrimaryKey[]>{
    private _indexes: PrimaryKey[]

    public get index() {
        return this._indexes
    }

    public get output() {
        return this.collection.getDataFromKeys(this._indexes)
    }

    constructor(public collection: Collection<DataType>, initalIndex: PrimaryKey[] = [], config: { name?: string } = {}, public primaryKey: PrimaryKey) {
        super(initalIndex)
        if (config.name) this.key(config.name)
    }

    public add(indexes: PrimaryKey | PrimaryKey[]) {
        if (!Array.isArray(indexes)) indexes = [indexes]
        indexes.forEach(index => {
            if (!(index in this._indexes)) {
                this._indexes.push(index)
            }
        })
        return this;
    }

    public remove(indexes: PrimaryKey | PrimaryKey[]) {
        if (!Array.isArray(indexes)) indexes = [indexes]
        indexes.forEach(index => {
            if (index in this._indexes) {
                this._indexes = this._indexes.filter(key => (key !== index))
            }
        })
        return this;
    }

    public reset() {
        this._indexes = []
        return this
    }
}