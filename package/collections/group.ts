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

    constructor(public collection: Collection<DataType>, initalIndex: PrimaryKey[] = [], config: { name?: string } = {}) {
        super(initalIndex)
        if (config.name) this.key(config.name)
        this._data = collection.getDataFromKeys(initalIndex)
    }

    public add(indexes: PrimaryKey | PrimaryKey[]) {
        if (Array.isArray(indexes)) {
            indexes.forEach(index => {
                if (!(index in this._indexes)) {
                    this._indexes.push(index)
                }
            })
            this.collection.getDataFromKeys(indexes).forEach(data => {
                this._data.push(data)
            })
        } else {
            this._indexes.push(indexes)
            this.collection.getDataFromKeys([indexes]).forEach(data => {
                this._data.push(data)
            })
        }
        return;
    }

    public remove(indexes: PrimaryKey | PrimaryKey[]) {
        if (Array.isArray(indexes)) {
            indexes.forEach(index => {
                if (index in this._indexes) {
                    delete this._indexes[index]
                    delete this._data[index]
                }
            })
        } else {
            if (indexes in this._indexes) {
                delete this._indexes[indexes]
                delete this._data[indexes]
            }
        }
        return;
    }
}