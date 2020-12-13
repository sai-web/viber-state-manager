import { EventConfig } from './interfaces'

/*
    Events allow to fire certain incidents
    because this will run globally throughout the application these events will be registered across all components
*/

export class Event {
    private _callbacks: Function[]
    private _uses: number
    constructor(private config: EventConfig) {
        if (this.config.disableAfterUses) this._uses = 0
    }

    //attach a new callback
    public on(callback: () => void) {
        if (!this.config.active) { console.error(`Disabled event was attached a callback`); return }
        const cleanUpFunc = () => {
            this.unsub(callback)
        }
        if (this.config.maxSubs && this._callbacks.length === this.config.maxSubs) return cleanUpFunc
        if (this.config.disableAfterUses && this.config.disableAfterUses < this._uses) {
            this.disable()
            return cleanUpFunc
        }
        this._callbacks.push(callback)
        return cleanUpFunc
    }

    //call all the callbacks and increment the uses
    public emit() {
        if (!this.config.active) { console.error(`Disabled event was emitted`); return }
        this._callbacks.forEach(callback => {
            callback()
        })
        if (this.config.disableAfterUses) this._uses++
    }
    public disable() {
        this.config.active = false
    }
    public onNext(callback: () => void) {
        if (!this.config.active) { console.error(`Disabled event was attached a callback`); return }
        this._callbacks.push(() => {
            callback()
            this.unsub(callback)
        })
    }

    //filter the callbacks to remove certain callbacks
    private unsub(callback: Function) {
        this._callbacks = this._callbacks.filter(emitter => {
            return emitter !== callback
        })
    }
}