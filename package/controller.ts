/*
    coming soon in version 1.0.1
*/

import { ControllerConfig } from "./interfaces";
import { State, Collection, Compute, Event } from "./internal";

export class Controller {
    public states: Record<string, State | Compute>
    public collections: Record<string, Collection<Record<string, any>>>
    public events: Record<string, Event>
    public actions: Record<string, any>

    public root() {
        return {
            states: this.states,
            collections: this.collections,
            events: this.events,
            actions: this.actions
        }
    }

    constructor(public config: ControllerConfig) {
        if (config.states) this.initializeStates()
        if (config.collections) this.initializeCollections()
        if (config.events) this.initializeEvents()
        if (config.actions) this.initializeActions()
    }

    private initializeStates() {
        Object.keys(this.config.states).forEach(state => {
            this.states[state] = this.config.states[state]
        })
    }
    private initializeCollections() {
        Object.keys(this.config.collections).forEach(collection => {
            this.collections[collection] = this.config.collections[collection]
        })
    }
    private initializeEvents() {
        Object.keys(this.config.events).forEach(event => {
            this.events[event] = this.config.events[event]
        })
    }
    private initializeActions() {
        Object.keys(this.config.actions).forEach(action => {
            this.actions[action] = this.config.actions[action]
        })
    }

    public reset() {
        Object.values(this.states).forEach(state => {
            state.reset()
        })
        Object.values(this.collections).forEach(collection => {
            collection.reset()
        })
    }
}