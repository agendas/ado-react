import {ReducerRegistry} from "../state/reducer";
import chooserReducer from "./chooser/reducer";

export function setupReducers(registry: ReducerRegistry) {
    registry.register(chooserReducer);
}