import {Task, TaskList} from "../core/models";
import {AnyAction, Reducer} from "redux";

export interface AdoState extends Record<string, any> {
    model?: ModelState;
}

export type AdoReducer = Reducer<AdoState, AnyAction>;

export interface ModelState {
    lists: Map<string, TaskList>;
    tasks: Map<string, Map<string, Task>>;
}

interface AdoModelBaseAction extends AnyAction {
    type: AdoModelTypes;
    operation: AdoModelOperations;
}

export enum AdoModelTypes {
    list = "model:list",
    task = "model:task"
}

export enum AdoModelOperations {
    add = "add",
    bulkAdd = "bulkAdd",
    set = "set",
    delete = "delete",
    update = "update"
}

export interface AdoModelListAddAction extends AdoModelBaseAction {
    type: AdoModelTypes.list;
    operation: AdoModelOperations.add | AdoModelOperations.set;
    list: TaskList;
}

export interface AdoModelTaskAddAction extends AdoModelBaseAction {
    type: AdoModelTypes.task;
    operation: AdoModelOperations.add | AdoModelOperations.set;
    listId: string;
    task: Task;
}

export interface AdoModelListBulkAddAction extends AdoModelBaseAction {
    type: AdoModelTypes.list;
    operation: AdoModelOperations.bulkAdd;
    lists: TaskList[];
}

export interface AdoModelTaskBulkAddAction extends AdoModelBaseAction {
    type: AdoModelTypes.task;
    operation: AdoModelOperations.bulkAdd;
    listId: string;
    tasks: Task[];
}

interface AdoModelPropertyAction extends AdoModelBaseAction {
    operation: AdoModelOperations.update;
    id: string;
    property: string;
    value: any;
}

export interface AdoModelListPropertyAction extends AdoModelPropertyAction {
    type: AdoModelTypes.list;
}

export interface AdoModelTaskPropertyAction extends AdoModelPropertyAction {
    type: AdoModelTypes.task;
    listId: string;
}

export interface AdoModelDeleteAction extends AdoModelBaseAction {
    operation: AdoModelOperations.delete;
    listId: string;
    id: string;
}

export type AdoModelListAction = AdoModelListAddAction | AdoModelListBulkAddAction | AdoModelListPropertyAction | AdoModelDeleteAction;
export type AdoModelTaskAction = AdoModelTaskAddAction | AdoModelTaskBulkAddAction | AdoModelTaskPropertyAction | AdoModelDeleteAction;
export type AdoModelAction = AdoModelListAction | AdoModelTaskAction;