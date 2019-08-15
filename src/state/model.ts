import {AdoAction, AdoModelAction, AdoModelActions, AdoModelTypes, ModelState} from "./interfaces";

export default function modelReducer(anyState: any = {tasks: new Map(), lists: new Map()}, anyAction: AdoAction): ModelState {
    let state = anyState as ModelState;
    let action = anyAction as AdoModelAction;

    switch (action.type) {
        case AdoModelTypes.list:
            switch (action.action) {
                case AdoModelActions.add:
                case AdoModelActions.set:
                    let tasks = state.tasks;
                    if (!tasks.has(action.list.id)) {
                        tasks = new Map([...tasks, [action.list.id, new Map()]]);
                    }
                    return {tasks, lists: new Map([...state.lists, [action.list.id, action.list]])};

                case AdoModelActions.bulkAdd:
                    return {tasks: state.tasks, lists: new Map([...state.lists].concat(action.lists.map(list => [list.id, list])))};

                case AdoModelActions.update:
                    if (action.property === "id") {
                        throw new Error("Attempt to change ID of list");
                    }

                    if (state.lists.has(action.id)) {
                        let list = Object.assign({}, state.lists.get(action.id));
                        list[action.property] = action.value;

                        return {
                            tasks: state.tasks,
                            lists: new Map([...state.lists, [action.id, list]])
                        };
                    } else {
                        return state;
                    }

                case AdoModelActions.delete:
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

            switch (action.action) {
                case AdoModelActions.add:
                case AdoModelActions.set:
                    return {
                        lists: state.lists,
                        tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId), [action.task.id, action.task]])]])
                    };

                case AdoModelActions.bulkAdd:
                    return {
                        lists: state.lists,
                        tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId)].concat(action.tasks.map(task => [task.id, task])))]])
                    };

                case AdoModelActions.update:
                    if (action.property === "id") {
                        throw new Error("Attempt to change ID of task");
                    }

                    if (state.tasks.get(action.listId)!.has(action.id)) {
                        let task = Object.assign({}, state.tasks.get(action.listId)!.get(action.id));
                        task[action.property] = action.value;

                        return {
                            lists: state.lists,
                            tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId), [action.id, task]])]])
                        };
                    } else {
                        return state;
                    }

                case AdoModelActions.delete:
                    return {
                        tasks: new Map([...state.tasks, [action.listId, new Map([...state.tasks.get(action.listId)].filter(entry => entry[0] !== action.id))]]),
                        lists: state.lists
                    };
            }
            break;
    }

    return anyState;
}