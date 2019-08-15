import {Task, TaskList} from "../core/models";
import {Action, Reducer} from "redux";

export interface AdoState extends Record<string, any> {
    model: ModelState;
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

export interface AdoModelAction extends AdoAction {
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
    update = "update",
    delete = "delete"
}

export interface AdoModelListAction extends AdoModelAction {
    namespace: AdoStateNamespaces.model;
    type: AdoModelTypes.list;
    action: AdoModelActions.add | AdoModelActions.update;
    list: TaskList;
}

export interface AdoModelTaskAction extends AdoModelAction {
    type: AdoModelTypes.task;
    action: AdoModelActions.add | AdoModelActions.update;
    task: Task;
}

export interface AdoModelDeleteAction extends AdoModelAction {
    action: AdoModelActions.delete;
    id: string;
}