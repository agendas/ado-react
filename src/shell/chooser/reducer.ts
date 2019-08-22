import {AdoAction, AdoModelAction, AdoModelOperations, AdoModelTypes, AdoStateNamespaces} from "../../state/interfaces";
import {ChooserAction, ChooserActionType, ChooserNamespace, ChooserState} from "./interfaces";

function select(state: ChooserState, id: string): ChooserState {
    return state.selected.has(id) ? state : {selected: new Set([...state.selected].concat(id))};
}

function deselect(state: ChooserState, id: string): ChooserState {
    return state.selected.has(id) ? {selected: new Set([...state.selected].filter(i => i !== id))} : state;
}

function chooserReducer(state: ChooserState = {selected: new Set()}, action: ChooserAction | AdoModelAction): ChooserState {
    if (action.namespace === AdoStateNamespaces.model) {
        if (action.type === AdoModelTypes.list) {
            if (action.operation === AdoModelOperations.delete) {
                return deselect(state, action.id);
            }
        }
    }

    if (action.namespace === ChooserNamespace) {
        if (action.type === ChooserActionType.select) {
            return select(state, action.id);
        } else if (action.type === ChooserActionType.deselect) {
            return deselect(state, action.id);
        }
    }

    return state;
}

export default function(state: any, action: AdoAction) {
    return chooserReducer(state as ChooserState, action as (ChooserAction | AdoModelAction));
}