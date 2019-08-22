import {AdoAction} from "../../state/interfaces";

export const ChooserNamespace = "chooser";

export interface ChooserState {
    selected: Set<string>;
}

export enum ChooserActionType {
    select, deselect
}

export interface ChooserAction extends AdoAction {
    namespace: "chooser";
    type: ChooserActionType;
    id: string;
}