import { Group } from '../internal'

interface CollectionConfigOptions<DataType> {
    primaryKey?: string
    groups?: Record<string, Group<DataType>>
}

type PrimaryKey = string | number

export class Collection<DataType>{
    private _config: CollectionConfigOptions<DataType>
    private _data: Record<PrimaryKey, DataType>

    private _groups: Record<string, Group<DataType>>

    constructor(config: (instance: Collection<DataType>) => CollectionConfigOptions<DataType>) {
        if (typeof config === "function") this._config = config(this)

        if (this._config.groups) this._initializeGroups()
        if (!this._config.primaryKey) this._config.primaryKey = 'id'
    }

    public Group() {
        return new Group<DataType>(this, [], {}, this._config.primaryKey)
    }

    private _initializeGroups() {
        const keys = Object.keys(this._config.groups)
        keys.forEach(group => {
            if (!this._config.groups[group].name) this._config.groups[group].key(group)
            if (!this._groups[group]) this._groups[group] = this._config.groups[group]
        })
    }

    public collect(items: DataType | DataType[], groups: string | string[]) {
        if (!Array.isArray(items)) items = [items]
        if (!Array.isArray(groups)) groups = [groups]
        groups.forEach(group => {
            this._groups[group].add((items as DataType[]).map(item => (item[this._config.primaryKey])))
        })
        items.forEach(item => {
            this._data[item[this._config.primaryKey]] = item
        })
    }

    public shiftGroups(keys: PrimaryKey | PrimaryKey[], removalGroup: Group<DataType>, recieverGroup: Group<DataType>) {
        if (!Array.isArray(keys)) keys = [keys]
        removalGroup.remove(keys)
        recieverGroup.add(keys)
    }

    public getGroups() {
        return this._groups
    }

    public getDataFromKeys(indexes: PrimaryKey[]): NonNullable<DataType[]> {
        const requiredData = indexes.map(index => {
            return this._data[index]
        })
        return requiredData
    }

    public removeData(indexes: PrimaryKey | PrimaryKey[]) {
        if (Array.isArray(indexes)) {
            indexes.forEach(index => {
                delete this._data[index]
            })
        } else {
            delete this._data[indexes]
        }
        return;
    }
}