import { State } from './internal'

/*
    the Compute class is exported
    this inherits the State class
*/

export class Compute<ComputedType = any> extends State {
    public get value() {
        return this._value
    }
    public key(ComputeName: string) {
        this.name = ComputeName
        return this
    }
    public patch() {
        console.error('The patch method cannot be called on computed values')
        return this
    }
    constructor(public ComputeFunc: () => ComputedType, public deps: State[]) {
        super(ComputeFunc())
        deps.forEach(state => {
            state.watch(this.name, this.recompute)
        })
    }

    public compute() {
        return this.ComputeFunc()
    }
    public recompute() {
        this.set(this.compute())
    }
    public reset() {
        super.reset()
        this.recompute()
        return this
    }
}