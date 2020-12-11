import { State, StateGroup, Compute } from './internal'

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
}