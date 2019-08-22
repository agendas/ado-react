import {AdoAction, AdoReducer, AdoState, AdoStateNamespaces} from "./interfaces";
import {createStore, Store} from "redux";
import modelReducer from "./model";

export class ReducerRegistry {
    private readonly reducers: Record<string, {property: string, reducer: AdoReducer}[]>;

    public constructor(reducers?: Record<string, {property: string, reducer: AdoReducer}[]>) {
        if (reducers) {
            this.reducers = reducers;
        } else {
            this.reducers = {};
            this.reducers[AdoStateNamespaces.model] = [{property: "model", reducer: modelReducer}];
        }
    }

    public register(namespaces: string | string[], reducer: AdoReducer, property: string) {
        let arr = typeof namespaces === "string" ? [namespaces] : namespaces;
        let reducerObj = {property, reducer};
        arr.forEach(namespace => {
            if (this.reducers[namespace]) {
                this.reducers[namespace].push(reducerObj);
            } else {
                this.reducers[namespace] = [reducerObj];
            }
        });
    }

    public reduce(state: AdoState = {}, action: AdoAction): AdoState {
        let reducers = this.reducers[action.namespace];
        if (reducers) {
            let newState = {...state};
            reducers.forEach(({property, reducer}) => {
                newState[property] = reducer(newState[property], action);
            });
            return newState;
        } else {
            return state;
        }
    }

    public createStore(): Store<AdoState, AdoAction> {
        return createStore(this.reduce);
    }
}