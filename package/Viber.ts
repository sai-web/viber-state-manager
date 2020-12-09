import { State } from './state'

export class Viber {
    constructor() {

    }

    //create a new state variable
    public State<StateType>(value: StateType) {
        return new State<StateType>(value)
    }
}