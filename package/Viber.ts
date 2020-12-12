import { State, StateGroup, Compute, Event, Collection } from './internal'
import { EventConfig, CollectionConfigOptions } from './interfaces'

export class Viber {
    private _states: State[]
    private _computes: Compute[]
    private _events: Event[]
    private _collections: Collection<Record<string, any>>[]

    public get root() {
        return {
            states: this._states,
            computes: this._computes,
            events: this._events,
            collections: this._collections
        }
    }

    constructor() {

    }

    //create a new state variable
    public State<StateType>(value: StateType) {
        const state = new State<StateType>(value)
        this._states.push(state)
        return state
    }

    //creates a group of states without type checking
    public StateGroup(states: Record<string, any>) {
        return StateGroup(states)
    }

    //creates a new computed variable
    public Compute<ComputedType>(computedFunc: () => ComputedType, deps: State[]) {
        const compute = new Compute(computedFunc, deps)
        this._computes.push(compute)
        return compute
    }

    //creates a new Event emitter
    public Event(config: EventConfig = { active: true }) {
        const event = new Event(config)
        this._events.push(event)
        return event
    }

    //create a collection
    public Collection<DataType>(config: (instance: Collection<DataType>) => CollectionConfigOptions<DataType>) {
        const collection = new Collection(config)
        this._collections.push(collection)
        return collection
    }
}