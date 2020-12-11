import { State, StateGroup, Compute, Event } from './internal'
import { EventConfig } from './interfaces'

export class Viber {
    constructor() {

    }

    //create a new state variable
    public State<StateType>(value: StateType) {
        return new State<StateType>(value)
    }

    //creates a group of states without type checking
    public StateGroup(states: Record<string, any>) {
        return StateGroup(states)
    }

    //creates a new computed variable
    public Compute<ComputedType>(computedFunc: () => ComputedType, deps: State[]) {
        return new Compute(computedFunc, deps)
    }

    //creates a new Event emitter
    public Event(config: EventConfig = { active: true }) {
        return new Event(config)
    }
}