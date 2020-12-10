/*
    the State class is a default export
    the StateGroup is a named export : allows you to pass an object of [key:string]:any and retrieve an object of states
    note: you loose type checking when you use StateGroup
*/

interface StateClass<ValueType> {
    name: string
    key: (name: string) => this
    value: ValueType
    set: (value: ValueType) => void | this
    exists: () => boolean
    patch: (patchableObject: Object) => this
    watch: (name: string, watcher: Function) => this
    removeWatcher: (name: string) => this
    onNext: (NextFunc: Function) => this
    is: (value: any) => boolean
    isNot: (value: any) => boolean
}

export default class State<StateType = any> implements StateClass<StateType> {
    //this is the mehod to recognizes the state
    public name: string
    //stores the value contained by the state
    private _value: StateType

    //collection of function that will run after the state changes
    private _watchers: Record<string, Function>

    //set the state name
    public key(stateName: string) {
        if (!this.name) this.name = stateName
        return this
    }

    //getter for the state value
    public get value() {
        return this._value
    }

    //setter for the state value
    public set(newState: StateType) {
        if (typeof newState !== typeof this._value) {
            console.log(`Incorrect type ${newState} was provided`)
        } else {
            this._value = newState
            this.fireWatchers()
            return this
        }
    }

    //check the truthiness of the state
    public exists() {
        return !!this.value
    }

    constructor(initialState: StateType) {
        this._value = initialState
    }

    //patch state objects together
    public patch(targetToChange, config: { deep?: boolean } = {}) {
        if (!(typeof this._value === 'object') || !(typeof targetToChange === "object")) return this
        this.set(config.deep ? shallowMerge(this._value, targetToChange) : deepMerge(this._value, targetToChange))
        this.fireWatchers()
        return this
    }

    //watcher are like callback function after the state updates
    private fireWatchers() {
        Object.keys(this._watchers).map(watcher => this._watchers[watcher]())
    }

    public watch(name: string, watcher: Function) {
        this._watchers[name] = watcher
        return this
    }

    public removeWatcher(name: string) {
        delete this._watchers[name]
        return this
    }

    //onNext is a watcher that fires only once after the next state update
    public onNext(NextFunc: Function) {
        this._watchers['_on_next_'] = () => {
            NextFunc()
            delete this._watchers['_on_next_']
        }
        return this
    }

    public is(value: any) {
        return this._value === value
    }

    public isNot(value: any) {
        return this._value !== value
    }
}

//create a group of states
export function StateGroup(groups: Record<string, any>) {
    let collection = {}
    Object.keys(groups).forEach(state => {
        collection[state] = new State(groups[state])
    })
    return collection
}

function shallowMerge(source, props) {
    Object.keys(props).forEach(prop => {
        source[prop] = props[prop]
    })
    return source
}

function parseObj(obj: Record<string, any>, param, value) {
    Object.keys(obj).map(key => {
        if (typeof obj[key] === 'object') {
            parseObj(obj[key], param, value)
        } else {
            if (obj[param]) obj[param] = value
        }
    })
}

function deepMerge(source, props) {
    Object.keys(props).map(key => {
        parseObj(source, key, props[key])
    })
}