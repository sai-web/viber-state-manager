import { State, Collection } from '../internal'

type PrimaryKey = string | number

export class Group<DataType> extends State<PrimaryKey[]>{
    private _indexes: PrimaryKey[]
    private _data: DataType[]

    public get index() {
        return this._indexes
    }

    public get output() {
        return this._data
    }

    constructor(public collection: Collection<DataType>, initalIndex: PrimaryKey[] = [], config: { name?: string } = {}, public primaryKey: PrimaryKey) {
        super(initalIndex)
        if (config.name) this.key(config.name)
        this._data = collection.getDataFromKeys(initalIndex)
    }

    public add(indexes: PrimaryKey | PrimaryKey[]) {
        if (!Array.isArray(indexes)) indexes = [indexes]
        indexes.forEach(index => {
            if (!(index in this._indexes)) {
                this._indexes.push(index)
                this.collection.getDataFromKeys([index]).forEach(data => this._data.push(data))
            }
        })
        return this;
    }

    public remove(indexes: PrimaryKey | PrimaryKey[]) {
        if (!Array.isArray(indexes)) indexes = [indexes]
        indexes.forEach(index => {
            if (index in this._indexes) {
                this._indexes = this._indexes.filter(key => (key !== index))
                this._data = this._data.filter(item => (item[this.primaryKey] !== index))
            }
        })
        return this;
    }

    public reset() {
        this._data = []
        this._indexes = []
        return this
    }
}