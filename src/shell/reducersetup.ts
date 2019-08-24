import {ReducerRegistry} from "../state/reducer";
import {ChooserNamespace} from "./chooser/interfaces";
import chooserReducer from "./chooser/reducer";

export function setupReducers(registry: ReducerRegistry) {
    registry.register(ChooserNamespace, chooserReducer, ChooserNamespace);
}