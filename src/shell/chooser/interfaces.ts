import {TaskList} from "../../core/models";

export interface ChooserState {
    selected: Set<string>;
}

export enum ChooserActionType {
    select = "chooser:select", deselect = "chooser:deselect"
}

export interface ChooserAction {
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