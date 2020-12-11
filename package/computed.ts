import { State } from './internal'

/*
    the Compute class is exported
    this inherits the State class
*/

export class Compute<ComputedType = any> extends State {
    private _index: number[]
    public get value() {
        return this._value
    }
    //give the computed function a name
    public key(ComputeName: string) {
        this.name = ComputeName
        return this
    }
    public patch() {
        console.error('The patch method cannot be called on computed values')
        return this
    }
    //create a state computation
    constructor(public ComputeFunc: () => ComputedType, public deps: State[]) {
        super(ComputeFunc())
        this._index = deps.map(state => (state.watchers["_computed_functions_"].length))
        //get the dependencies and add the computation to its watcher
        deps.forEach(state => {
            state.watch('_computed_functions_', [...(state.watchers['_computed_functions_'] as Function[]), this.recompute])
        })
    }

    public compute() {
        return this.ComputeFunc()
    }
    public recompute() {
        this.set(this.compute())
    }
    //remove the computed function
    public removeComputation(deps: State[]) {
        this.deps.forEach((state: any, index: number) => {
            if (state in deps) {
                delete state.watchers['_computed_functions_'][this._index[index]]
            }
        })
        return this
    }
    //reset the computational value
    public reset() {
        super.reset()
        this.recompute()
        return this
    }
}