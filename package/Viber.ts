import State, { StateGroup } from './state'

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
}