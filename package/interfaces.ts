//types and interfaces for states
export interface StateClass<ValueType> {
    name: string
    key: (name: string) => this
    value: ValueType
    set: (value: ValueType | setStateFunc<ValueType>) => null | this
    exists: boolean
    patch: (patchableObject: Object) => this
    watch: (name: string, watcher: Function | Function[]) => this
    removeWatcher: (name: string) => this
    onNext: (NextFunc: Function) => this
    is: (value: any) => boolean
    isNot: (value: any) => boolean
    reset: () => this
    undo: () => this
}

export type setStateFunc<ValueType> = (state: ValueType) => ValueType

export type InternalInformation<ValueType> = {
    name?: string
    value: ValueType
    initialValue: ValueType
    previousState: ValueType
}

//types and interfaces for events
export interface EventConfig {
    name?: string
    maxSubs?: number
    active: boolean
    disableAfterUses?: number
}