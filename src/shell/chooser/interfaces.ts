import {AdoAction} from "../../state/interfaces";
import {TaskList} from "../../core/models";

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

export interface ListChooserProps {
    lists: TaskList[];
    selected: Set<string>;
    onAddList(name: string): void;
    onSelect(id: string): void;
    onDeselect(id: string): void;
    onDelete(id: string): void;
}