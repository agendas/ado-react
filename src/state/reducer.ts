import {AdoAction, AdoReducer, AdoState} from "./interfaces";
import {createStore, Store} from "redux";

export class ReducerRegistry {
    private reducers: Map<string, AdoReducer>;

    public constructor(reducers: Map<string, AdoReducer> = new Map()) {
        this.reducers = reducers;
    }

    public register(namespace: string, reducer: AdoReducer) {
        if (this.reducers.has(namespace)) {
            throw new Error(`Namespace "${namespace}" already exists in registry`);
        }

        this.reducers.set(namespace, reducer);
    }

    public isRegistered(namespace: string) {
        return this.reducers.has(namespace);
    }

    public deregister(namespace: string) {
        if (!this.reducers.has(namespace)) {
            throw new Error(`Namespace ${namespace} does not exist in registry`);
        }

        this.reducers.delete(namespace);
    }

    public reduce(state: AdoState = {model: {lists: new Map(), tasks: new Map()}}, action: AdoAction): AdoState {
        let reducer = this.reducers.get(action.namespace);
        if (reducer) {
            const newState = {...state};
            newState[action.namespace] = reducer(newState[action.namespace], action);
            return newState;
        } else {
            return state;
        }
    }

    public createStore(): Store<AdoState, AdoAction> {
        return createStore(this.reduce);
    }
}

