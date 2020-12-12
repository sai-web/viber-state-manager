/*
    the State class is a named export 
    the StateGroup is a named export : allows you to pass an object of [key:string]:any and retrieve an object of states
    note: you loose type checking when you use StateGroup
*/

import { StateClass, InternalInformation, setStateFunc } from './interfaces'

export class State<StateType = any> implements StateClass<StateType> {
    //this is the method to recognizes the state
    public name: string
    //stores the value contained by the state
    protected _value: StateType

    //collection of function that will run after the state changes
    public watchers: Record<string, Function | Function[]> = {}

    //this the required history of the State
    private _history: InternalInformation<StateType>

    //set the state name
    public key(stateName: string) {
        if (!this.name) this.name = stateName
        this._history.name = stateName
        return this
    }

    //getter for the state value
    public get value() {
        return this._value
    }

    //setter for the state value
    public set(newState: StateType | setStateFunc<StateType>) {
        if (typeof newState === "function") {
            newState = (newState as setStateFunc<StateType>)(this._value)
        }
        if (typeof newState !== typeof this._value) {
            console.error(`Incorrect type ${newState} was provided`)
            return null
        }
        let prevState = copy(this._value)
        this._value = newState as StateType
        this._history.previousState = prevState
        this._history.value = this._value
        this._fireWatchers()
        return this
    }

    //check the truthiness of the state
    public get exists() {
        return !!this.value
    }

    constructor(initialState: StateType) {
        this._value = initialState
        this._history = {
            value: this._value,
            initialValue: initialState,
            previousState: null
        }
    }

    //patch state objects together
    public patch(targetToChange, config: { deep?: boolean } = {}) {
        if (!(typeof this._value === 'object') || !(typeof targetToChange === "object")) return this
        this.set(config.deep ? deepMerge(this._value, targetToChange) : shallowMerge(this._value, targetToChange))
        this._fireWatchers()
        return this
    }

    //watcher are like callback function after the state updates
    private _fireWatchers() {
        Object.keys(this.watchers).map(watcher => {
            if (typeof this.watchers[watcher] === "function") (this.watchers[watcher] as Function)()
            else (this.watchers[watcher] as Function[]).forEach(watcher => {
                watcher()
            })
        })
    }

    public watch(name: string, watcher: Function | Function[]) {
        this.watchers[name] = watcher
        return this
    }

    public removeWatcher(name: string) {
        delete this.watchers[name]
        return this
    }

    public removeAllWatchers() {
        this.watchers = {}
        return this
    }

    //onNext is a watcher that fires only once after the next state update
    public onNext(NextFunc: Function) {
        this.watchers['_on_next_'] = () => {
            NextFunc()
            delete this.watchers['_on_next_']
        }
        return this
    }

    // public toggle(){
    //     if(typeof this._value === "boolean") this.set(!this._value)
    //     return this
    // }

    public is(value: any) {
        return this._value === value
    }

    public isNot(value: any) {
        return this._value !== value
    }

    //reset the values of the state from the history
    public reset() {
        this.set(this._history.initialValue)
        this.removeAllWatchers()
        return this
    }

    //undo the state change
    public undo() {
        this.set(this._history.previousState)
        return this
    }
}

//create a group of states
export function StateGroup(groups: Record<string, any>) {
    let collection: Record<string, State>
    Object.keys(groups).forEach(state => {
        collection[state] = new State(groups[state])
        collection[state].key(state)
    })
    return collection
}

function copy(value: any) {
    if (typeof value === "object") return { ...value }
    else if (Array.isArray(value)) return [...value]
    return value
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