import {AdoModelOperations, AdoModelTypes, AdoState} from "../../state/interfaces";
import {ChooserActionType, ChooserState} from "./interfaces";
import {Optional} from "../../core/utils";
import {AnyAction} from "redux";

function select(state: ChooserState = {selected: new Set()}, id: string): ChooserState {
    return state.selected.has(id) ? state : {selected: new Set([...state.selected].concat(id))};
}

function deselect(state: ChooserState = {selected: new Set()}, id: string): ChooserState {
    return state.selected.has(id) ? {selected: new Set([...state.selected].filter(i => i !== id))} : state;
}

export default function chooserReducer(state: AdoState = {}, action: AnyAction): AdoState {
    let chooser: Optional<ChooserState> = state.chooser;

    if (action.type === AdoModelTypes.list) {
        if (action.operation === AdoModelOperations.delete) {
            return {...state, chooser: deselect(chooser, action.id)};
        }
    }

    if (action.type === ChooserActionType.select) {
        return {...state, chooser: select(chooser, action.id)};
    } else if (action.type === ChooserActionType.deselect) {
        return {...state, chooser: deselect(chooser, action.id)};
    }

    return state;
}