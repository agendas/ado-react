import {
    AdoModelListAction,
    AdoModelTaskAction,
    AdoModelOperations,
    AdoModelTypes,
    AdoState,
    ModelState
} from "./interfaces";
import {makeImmutable, Optional} from "../core/utils";
import {cloneDeep} from "lodash";
import {AnyAction} from "redux";

export default function modelReducer(adoState: AdoState = {}, anyAction: AnyAction): AdoState {
    let state = adoState.model || {tasks: new Map(), lists: new Map()};
    let newModel: Optional<ModelState>;
    let action: AdoModelListAction | AdoModelTaskAction;

    switch (anyAction.type) {
        case AdoModelTypes.list:
            action = anyAction as AdoModelListAction;

            switch (action.operation) {
                case AdoModelOperations.add:
                case AdoModelOperations.set:
                    let tasks = state.tasks;
                    if (!tasks.has(action.list.id)) {
                        tasks = new Map([...tasks, [action.list.id, new Map()]]);
                    }
                    newModel = {tasks, lists: new Map([...state.lists, [action.list.id, makeImmutable(cloneDeep(action.list))]])};

                    break;

                case AdoModelOperations.bulkAdd:
                    let stateTasks = state.tasks;
                    let didChangeTasks = false;
                    action.lists.forEach(list => {
                        if (!stateTasks.has(list.id)) {
                            if (!didChangeTasks) {
                                didChangeTasks = true;
                                stateTasks = new Map([...stateTasks]);
                            }
                            stateTasks.set(list.id, new Map());
                        }
                    });
                    newModel = {tasks: stateTasks, lists: new Map([...state.lists].concat(action.lists.map(list => [list.id, makeImmutable(cloneDeep(list))])))};

                    break;

                case AdoModelOperations.update:
                    if (action.property === "id") {
                        throw new Error("Attempt to change ID of list");
                    }

                    if (state.lists.has(action.id)) {
                        let list = Object.assign({}, state.lists.get(action.id));
                        list[action.property] = cloneDeep(action.value);

                        newModel = {
                            tasks: state.tasks,
                            lists: new Map([...state.lists, [action.id, makeImmutable(list)]])
                        };
                    }

                    break;

                case AdoModelOperations.delete:
                    newModel = {
                        tasks: new Map([...state.tasks].filter(entry => entry[0] !== action.id)),
                        lists: new Map([...state.lists].filter(entry => entry[0] !== action.id))
                    };

                    break;
            }
            break;
        case AdoModelTypes.task:
            action = anyAction as AdoModelTaskAction;

            if (!state.tasks.has(action.listId)) {
                break;
            }

            switch (action.operation) {
                case AdoModelOperations.add:
                case AdoModelOperations.set:
                    newModel = {
                        lists: state.lists,
                        tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId), [action.task.id, makeImmutable(cloneDeep(action.task))]])]])
                    };

                    break;

                case AdoModelOperations.bulkAdd:
                    newModel = {
                        lists: state.lists,
                        tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId)].concat(action.tasks.map(task => [task.id, makeImmutable(cloneDeep(task))])))]])
                    };

                    break;

                case AdoModelOperations.update:
                    if (action.property === "id") {
                        throw new Error("Attempt to change ID of task");
                    }

                    if (state.tasks.get(action.listId)!.has(action.id)) {
                        let task = Object.assign({}, state.tasks.get(action.listId)!.get(action.id));
                        task[action.property] = cloneDeep(action.value);

                        newModel = {
                            lists: state.lists,
                            tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId), [action.id, makeImmutable(task)]])]])
                        };
                    }

                    break;

                case AdoModelOperations.delete:
                    newModel = {
                        tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId)].filter(entry => entry[0] !== action.id))]]),
                        lists: state.lists
                    };

                    break;
            }
            break;
    }

    return newModel ? {...adoState, model: newModel} : adoState;
}