import { Group } from '../internal'

interface CollectionConfigOptions<DataType> {
    primaryKey?: string
    groups?: Record<string, Group<DataType>>
}

type PrimaryKey = string | number

export class Collection<DataType>{
    private _config: CollectionConfigOptions<DataType>
    private _data: Record<PrimaryKey, DataType>

    private _groups: Group<DataType>[]

    constructor(config: (instance: Collection<DataType>) => CollectionConfigOptions<DataType>) {
        if (typeof config === "function") this._config = config(this)

        if (this._config.groups) this._initializeGroups()
        if (!this._config.primaryKey) this._config.primaryKey = 'id'
    }

    public Group() {
        return new Group<DataType>(this)
    }

    private _initializeGroups() {
        const keys = Object.keys(this._config.groups)
        keys.forEach(group => {
            if (!this._config.groups[group].name) this._config.groups[group].key(group)
            if (!this._groups[group]) this._config.groups[group]
        })
    }

    public getDataFromKeys(indexes: PrimaryKey[]): NonNullable<DataType[]> {
        const requiredData = indexes.map(index => {
            return this._data[index]
        })
        return requiredData
    }

    public removeData(indexes: PrimaryKey[]) {
        indexes.forEach(index => {
            delete this._data[index]
        })
        return;
    }
}