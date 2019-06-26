import {TaskList} from "../core/models";
import {List, Map} from "immutable";
import deepFreeze from "deep-freeze-strict";

/**
 * Stores Lists across an entire application.
 */
export class TaskListStore {
    /**
     * Private constructor. For internal use only.
     *
     * @param lists
     * @param listIds
     */
    private constructor(
        /**
         * Immutable map of Lists this store holds, where the ID is the key.
         */

        private lists: Map<string, TaskList>,
        /**
         * Immutable ordered list of list IDs this store holds.
         */
        private listIds: List<string>
    ) {}

    /**
     * Initializes a new empty TaskListStore.
     */
    public static make() {
        return new TaskListStore(Map(), List());
    }

    /**
     * Gets all lists that this store holds, in no particular order.
     *
     * @return an iterable object representing lists that this store holds
     */
    public allLists() {
        return this.lists.values();
    }

    /**
     * Gets all IDs of lists that this store holds.
     *
     * @return an immutable ordered list of IDs
     */
    public get orderedIds() {
        return this.listIds;
    }

    /**
     * Gets all lists that this store holds, in order of their ID.
     *
     * @return an immutable ordered list of TaskLists
     */
    public get orderedLists() {
        return this.listIds.map(key => {
            return this.get(key)!;
        });
    }

    /**
     * Gets the list with the specified ID, or undefined if it does not exist.
     *
     * @param id ID of the list
     * @return the list with the specified ID, or undefined if it does not exist
     */
    public get(id: string) {
        return this.lists.get(id);
    }

    /**
     * Gets whether the store contains a list with a specified ID.
     *
     * @param id ID to check for
     * @return whether the store contains a list with the specified ID
     */
    public contains(id: string) {
        return this.lists.has(id);
    }

    /**
     * Returns a new store with the added list.
     *
     * @param list list to update
     * @throws Error if list ID is not already in the store
     * @return a new store with the updated list
     */
    public updating(list: TaskList) {
        if (!this.lists.has(list.id)) {
            throw new Error("List not in store");
        }

        deepFreeze(list);

        return new TaskListStore(this.lists.set(list.id, list), this.listIds);
    }

    /**
     * Returns a new store with the new list.
     *
     * @param list list to add
     * @throws Error if list ID is already in the store
     * @return a new store with the added list
     */
    public adding(list: TaskList) {
        if (this.lists.has(list.id)) {
            throw new Error("List already in store");
        }

        deepFreeze(list);

        let index = 0;
        if (this.listIds.size > 0) {
            if (this.listIds.last(undefined)! < list.id) {
                index = this.listIds.size;
            } else if (this.listIds.first(undefined)! <= list.id) {
                let start = 0;
                let end = this.listIds.size - 1;
                index = Math.floor((start + end) / 2);

                while (start < end) {
                    let value = this.listIds.get(index)!;

                    if (value > list.id) {
                        end = index;
                    } else {
                        start = index + 1;
                    }

                    index = Math.floor((start + end) / 2);
                }
            }
        }

        return new TaskListStore(this.lists.set(list.id, list), this.listIds.insert(index, list.id));
    }

    /**
     * Returns a new store with the list of the specified ID deleted.
     *
     * @param id list ID to delete
     * @throws Error if list ID is not already in the store
     * @return a new store with the deleted list
     */
    public deleting(id: string) {
        if (!this.lists.has(id)) {
            throw new Error("List ID not in store")
        }

        let start = 0;
        let end = this.listIds.size - 1;
        let index = 0;
        while (start <= end) {
            index = Math.floor((start + end) / 2);
            let value = this.listIds.get(index)!;

            if (value === id) {
                break;
            } else if (value > id) {
                end = index - 1;
            } else {
                start = index + 1;
            }
        }

        return new TaskListStore(this.lists.delete(id), this.listIds.delete(index));
    }
}

export default TaskListStore;