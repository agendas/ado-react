import {AdoAction, AdoModelAction, AdoModelOperations, AdoModelTypes, ModelState} from "./interfaces";
import {makeImmutable} from "../core/utils";
import {cloneDeep} from "lodash";

export default function modelReducer(anyState: any = {tasks: new Map(), lists: new Map()}, anyAction: AdoAction): ModelState {
    let state = anyState as ModelState;
    let action = anyAction as AdoModelAction;

    switch (action.type) {
        case AdoModelTypes.list:
            switch (action.operation) {
                case AdoModelOperations.add:
                case AdoModelOperations.set:
                    let tasks = state.tasks;
                    if (!tasks.has(action.list.id)) {
                        tasks = new Map([...tasks, [action.list.id, new Map()]]);
                    }
                    return {tasks, lists: new Map([...state.lists, [action.list.id, makeImmutable(cloneDeep(action.list))]])};

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
                    return {tasks: stateTasks, lists: new Map([...state.lists].concat(action.lists.map(list => [list.id, makeImmutable(cloneDeep(list))])))};

                case AdoModelOperations.update:
                    if (action.property === "id") {
                        throw new Error("Attempt to change ID of list");
                    }

                    if (state.lists.has(action.id)) {
                        let list = Object.assign({}, state.lists.get(action.id));
                        list[action.property] = cloneDeep(action.value);

                        return {
                            tasks: state.tasks,
                            lists: new Map([...state.lists, [action.id, makeImmutable(list)]])
                        };
                    } else {
                        return state;
                    }

                case AdoModelOperations.delete:
                    return {
                        tasks: new Map([...state.tasks].filter(entry => entry[0] !== action.id)),
                        lists: new Map([...state.lists].filter(entry => entry[0] !== action.id))
                    };
            }
            break;
        case AdoModelTypes.task:
            if (!state.tasks.has(action.listId)) {
                return state;
            }

            switch (action.operation) {
                case AdoModelOperations.add:
                case AdoModelOperations.set:
                    return {
                        lists: state.lists,
                        tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId), [action.task.id, makeImmutable(cloneDeep(action.task))]])]])
                    };

                case AdoModelOperations.bulkAdd:
                    return {
                        lists: state.lists,
                        tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId)].concat(action.tasks.map(task => [task.id, makeImmutable(cloneDeep(task))])))]])
                    };

                case AdoModelOperations.update:
                    if (action.property === "id") {
                        throw new Error("Attempt to change ID of task");
                    }

                    if (state.tasks.get(action.listId)!.has(action.id)) {
                        let task = Object.assign({}, state.tasks.get(action.listId)!.get(action.id));
                        task[action.property] = cloneDeep(action.value);

                        return {
                            lists: state.lists,
                            tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId), [action.id, makeImmutable(task)]])]])
                        };
                    } else {
                        return state;
                    }

                case AdoModelOperations.delete:
                    return {
                        tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId)].filter(entry => entry[0] !== action.id))]]),
                        lists: state.lists
                    };
            }
            break;
    }

    return anyState;
}