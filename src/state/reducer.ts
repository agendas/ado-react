import {AdoReducer, AdoState} from "./interfaces";
import {AnyAction, createStore, Store} from "redux";
import modelReducer from "./model";

export class ReducerRegistry {
    private readonly reducers: AdoReducer[];

    public constructor(reducers?: AdoReducer[]) {
        if (reducers) {
            this.reducers = reducers;
        } else {
            this.reducers = [modelReducer];
        }
    }

    public register(reducer: AdoReducer) {
        this.reducers.push(reducer);
    }

    public reduce(state: AdoState = {}, action: AnyAction): AdoState {
        return this.reducers.reduce((theState, reducer) => reducer(theState, action), state);
    }

    public createStore(): Store<AdoState, AnyAction> {
        return createStore(this.reduce.bind(this));
    }
}