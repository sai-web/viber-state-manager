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

//types and interfaces for collections
import { Group } from './internal'
export interface CollectionConfigOptions<DataType> {
    primaryKey?: string
    groups?: Record<string, Group<DataType>>
}

//types and interfaces for controllers
import { State } from './state'
import { Compute } from './computed'
import { Collection } from './collections/collection'
import { Event } from './event'
export interface ControllerConfig {
    name?: string
    states?: Record<string, State | Compute>
    collections?: Record<string, Collection<{ [key: string]: any }>>
    actions?: Record<string, Function>
    events?: Record<string, Event>
    routes?: Record<string, Function>
}

//types and interfaces for api
export interface ApiConfig {
    options: RequestInit
    base?: string
    path?: string
    requestIntercept?: Function
    responseIntercept?: Function
}