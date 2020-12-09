export class State<StateType = any> {
    //stores the value contained by the state
    private _value: StateType

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

    public patch(targetToChange, config: { deep?: boolean } = {}) {
        if (!(typeof this._value === 'object')) return this
        this.set(config.deep ? shallowMerge(this._value, targetToChange) : deepMerge(this._value, targetToChange))
        return this
    }
}

function shallowMerge(source, props) {
    Object.keys(props).forEach(prop => {
        source[prop] = props[prop]
    })
    return source
}

function parseObj(obj: { [key: string]: any }, param, value) {
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