import {Task} from "../core/models";
import {Map, List} from "immutable";
import {Comparator, compareTasks} from "../core/compare";
import {makeImmutable, Optional} from "../core/utils";

export class TaskStore {
    private constructor(
        private tasks: Map<string, Map<string, Task>>,
        private taskIds: Map<string, List<string>>,
        private comparator: Comparator<Task>
    ) {}

    public static make(comparator: Comparator<Task> = compareTasks): TaskStore {
        return new TaskStore(Map(), Map(), comparator);
    }

    public allListIds(): IterableIterator<string> {
        return this.tasks.keys();
    }

    public containsListId(listId: string): boolean {
        return this.tasks.has(listId);
    }

    public addingListId(listId: string): TaskStore {
        if (this.containsListId(listId)) {
            throw new Error("List ID already in store");
        }

        return new TaskStore(this.tasks.set(listId, Map()), this.taskIds.set(listId, List()), this.comparator);
    }

    public deletingListId(listId: string): TaskStore {
        if (!this.containsListId(listId)) {
            throw new Error("List ID not in store");
        }

        return new TaskStore(this.tasks.delete(listId), this.taskIds.delete(listId), this.comparator);
    }

    public allTasks(listId: string): Optional<Map<string, Task>> {
        return this.tasks.get(listId);
    }

    public orderedTaskIds(listId: string): Optional<List<string>> {
        return this.taskIds.get(listId);
    }

    public orderedTasks(listId: string): Optional<List<Task>> {
        const tasks = this.tasks.get(listId);
        const taskIds = this.taskIds.get(listId);
        if (tasks) {
            return taskIds!.map(id => tasks.get(id)!)
        }
    }

    public getTask(listId: string, taskId: string): Optional<Task> {
        const tasks = this.tasks.get(listId);
        if (tasks) {
            return tasks.get(listId);
        }
    }

    public containsTask(listId: string, taskId: string): Optional<boolean> {
        const tasks = this.tasks.get(listId);
        if (tasks) {
            return tasks.has(taskId);
        }
    }

    public updatingTask(listId: string, task: Task): TaskStore {
        const tasks = this.tasks.get(listId);

        if (!tasks) {
            throw new Error("List ID in store");
        }

        if (!tasks.has(task.id)) {
            throw new Error("Task not in store");
        }

        if (this.comparator(tasks.get(task.id)!, task) !== 0) {
            makeImmutable(task);
            return new TaskStore(this.tasks.set(listId, tasks.set(task.id, task)), this.taskIds, this.comparator);
        } else {
            return this.deletingTask(listId, task.id).addingTask(listId, task);
        }
    }

    public addingTask(listId: string, task: Task): TaskStore {
        const tasks = this.tasks.get(listId);
        if (!tasks) {
            throw new Error("List ID in store");
        }

        if (tasks.has(task.id)) {
            throw new Error("Task already in store");
        }

        const taskIds = this.taskIds.get(listId)!;

        makeImmutable(task);

        let index = 0;
        if (taskIds.size > 0) {
            if (this.comparator(tasks.get(taskIds.last(undefined)!)!, task) < 0) {
                index = taskIds.size;
            } else if (this.comparator(tasks.get(taskIds.first(undefined)!)!, task) <= 0) {
                let start = 0;
                let end = taskIds.size - 1;
                index = Math.floor((start + end) / 2);

                while (start < end) {
                    let value = tasks.get(taskIds.get(index)!)!;

                    if (this.comparator(value, task) > 0) {
                        end = index;
                    } else {
                        start = index + 1;
                    }

                    index = Math.floor((start + end) / 2);
                }
            }
        }

        return new TaskStore(
            this.tasks.set(listId, tasks.set(task.id, task)),
            this.taskIds.set(listId, taskIds.insert(index, task.id)),
            this.comparator
        );
    }

    public deletingTask(listId: string, taskId: string): TaskStore {
        const tasks = this.tasks.get(listId);
        if (!tasks) {
            throw new Error("List ID in store");
        }

        const task = tasks.get(taskId);
        if (!task) {
            throw new Error("Task not in store");
        }

        const taskIds = this.taskIds.get(listId)!;

        let start = 0;
        let end = taskIds.size - 1;
        let index = 0;
        while (start <= end) {
            index = Math.floor((start + end) / 2);
            const compareResult = this.comparator(tasks.get(taskIds.get(index)!)!, task);

            if (compareResult === 0) {
                break;
            } else if (compareResult > 0) {
                end = index - 1;
            } else {
                start = index + 1;
            }
        }

        return new TaskStore(
            this.tasks.set(listId, tasks.delete(taskId)),
            this.taskIds.set(listId, taskIds.delete(index)),
            this.comparator
        );
    }
}