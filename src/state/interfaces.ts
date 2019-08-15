import {Task, TaskList} from "../core/models";
import {Action, Reducer} from "redux";

export interface AdoState extends Record<string, any> {
    model?: ModelState;
}

export interface AdoAction extends Record<string, any>, Action {
    namespace: string;
}

export type AdoReducer = Reducer<any, AdoAction>;

export enum AdoStateNamespaces {
    model = "model"
}

export interface ModelState {
    lists: Map<string, TaskList>;
    tasks: Map<string, Map<string, Task>>;
}

interface AdoModelBaseAction extends AdoAction {
    namespace: AdoStateNamespaces.model;
    type: AdoModelTypes;
    action: AdoModelActions;
}

export enum AdoModelTypes {
    list = "list",
    task = "task"
}

export enum AdoModelActions {
    add = "add",
    bulkAdd = "bulkAdd",
    set = "set",
    delete = "delete",
    update = "update"
}

export interface AdoModelListAction extends AdoModelBaseAction {
    namespace: AdoStateNamespaces.model;
    type: AdoModelTypes.list;
    action: AdoModelActions.add | AdoModelActions.set;
    list: TaskList;
}

export interface AdoModelTaskAction extends AdoModelBaseAction {
    type: AdoModelTypes.task;
    action: AdoModelActions.add | AdoModelActions.set;
    listId: string;
    task: Task;
}

export interface AdoModelListBulkAddAction extends AdoModelBaseAction {
    namespace: AdoStateNamespaces.model;
    type: AdoModelTypes.list;
    action: AdoModelActions.bulkAdd;
    lists: TaskList[];
}

export interface AdoModelTaskBulkAddAction extends AdoModelBaseAction {
    namespace: AdoStateNamespaces.model;
    type: AdoModelTypes.task;
    action: AdoModelActions.bulkAdd;
    listId: string;
    tasks: Task[];
}

interface AdoModelPropertyAction extends AdoModelBaseAction {
    action: AdoModelActions.update;
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
    action: AdoModelActions.delete;
    listId: string;
    id: string;
}

export type AdoModelAction = AdoModelListAction | AdoModelTaskAction | AdoModelListBulkAddAction | AdoModelTaskBulkAddAction | AdoModelListPropertyAction | AdoModelTaskPropertyAction | AdoModelDeleteAction;
