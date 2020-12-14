import { State, StateGroup, Compute, Event, Collection, Api } from './internal'
import { EventConfig, CollectionConfigOptions, ControllerConfig, ApiConfig } from './interfaces'
import { Controller } from './controller'

/*
    this class allows you to initiate all the facilities we provide
    sooner we will implement a tracking mechanism to track the state of the compiler as well
*/

export class Viber {
    private _states: State[]
    private _computes: Compute[]
    private _events: Event[]
    private _collections: Collection<Record<string, any>>[]
    private _controllers: Controller[]

    public get root() {
        return {
            states: this._states,
            computes: this._computes,
            events: this._events,
            collections: this._collections,
            controllers: this._controllers
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

    //create an action
    public Action(func: Function) {
        return () => (func(this))
    }

    //create a controller
    public Controller(config: ControllerConfig) {
        const controller = new Controller(config)
        this._controllers.push(controller)
        return controller
    }

    //create an api instance
    public Api(config: ApiConfig) {
        return new Api(config)
    }
}