import {TaskStore} from "../TaskStore";
import {Comparator, compareTasks} from "../../core/compare";
import {DeadlineType, Task} from "../../core/models";
import {createStore} from "redux";

function expectInOrder(store: TaskStore, listId: string, comparator: Comparator<Task>) {
    const ordered = store.orderedTasks(listId)!;
    expect(ordered).toEqual(ordered.sort(comparator))
}

describe("make()", () => {
    it("initializes an empty store", () => {
        const store = TaskStore.make();
        expect(Array.from(store.allListIds()).length).toEqual(0);
    });
});

describe("addingListId()", () => {
   it("adds list IDs and returns a new store", () => {
       const id = "my-list";

       const store = TaskStore.make();
       const added = store.addingListId(id);

       expect(Array.from(added.allListIds())).toEqual([id]);
       expect(added.containsListId(id)).toBe(true);

       expect(Array.from(store.allListIds())).toEqual([]);
       expect(store.containsListId(id)).toBe(false);
       expect(store !== added);
   });

   it("throws on duplicate list IDs", () => {
      const id = "my-list";
      expect(() => TaskStore.make().addingListId(id).addingListId(id)).toThrow();
   });
});

describe("deletingListId()", () => {
    it("deletes list IDs and returns a new store", () => {
        const id = "my-list";

        const store = TaskStore.make().addingListId(id);
        const deleted = store.deletingListId(id);

        expect(Array.from(deleted.allListIds())).toEqual([]);
        expect(deleted.containsListId(id)).toBe(false);

        expect(Array.from(store.allListIds())).toEqual([id]);
        expect(store.containsListId(id)).toBe(true);
        expect(store !== deleted);
    });

    it("throws on unknown list IDs", () => {
        const id = "my-list";
        expect(() => TaskStore.make().deletingListId(id)).toThrow();
    });
});

describe("deletingTask()", () => {
    it("throws on unknown list IDs", () => {
       expect(() => TaskStore.make().addingTask("my-list", {id: "1", created_at: 0})).toThrow();
    });

    it("throws on duplicate tasks", () => {
        const list = "my-list";
        const id = "1";
        const store = TaskStore.make().addingListId("my-list").addingTask(list, {id, created_at: 0});
        expect(() => store.addingTask(list, {id, created_at: 1})).toThrow();
    });

    it("deletes tasks in order and returns a new store", () => {
        const tasks: Task[] = [
            {id: "1", created_at: 0},
            {id: "2", deadline: {type: DeadlineType.Date, date: 0}, created_at: -1},
            {id: "3", deadline: {type: DeadlineType.Date, date: -1}, created_at: 2},
            {id: "4", priority: 2, created_at: -1}
        ];

        const comparator = (a: Task, b: Task) => -compareTasks(a, b);
        const listId = "my-list";

        let store = tasks.reduce((store, task) => store.addingTask(listId, task), TaskStore.make(comparator).addingListId(listId));

        tasks.forEach((task, idx) => {
            const deleted = store.deletingTask(listId, task.id);
            expect(deleted === store).toEqual(false);

            expect(deleted.getTask(listId, task.id)).toBeFalsy();

            expect(deleted.containsTask(listId, task.id)).toEqual(false);
            expect(store.containsTask(listId, task.id)).toEqual(true);

            expect(deleted.allTasks(listId)!.size).toEqual(tasks.length - idx - 1);
            expect(store.allTasks(listId)!.size).toEqual(tasks.length - idx);

            expect(deleted.orderedTaskIds(listId)!.size).toEqual(tasks.length - idx - 1);
            expect(store.allTasks(listId)!.size).toEqual(tasks.length - idx);

            expect(() => task.sdf = "").toThrow();
            expect(() => task.created_at = 3).toThrow();

            store = deleted;

            expectInOrder(store, listId, comparator);
        });
    });
});

describe("addingTask()", () => {
    it("throws on unknown list IDs", () => {
        expect(() => TaskStore.make().deletingTask("my-list", "1")).toThrow();
    });

    it("throws on unknown tasks", () => {
        const list = "my-list";
        const store = TaskStore.make().addingListId(list);
        expect(() => store.deletingTask(list, "1")).toThrow();
    });

    it("adds tasks in order and returns a new store (default comparator)", () => {
        const tasks: Task[] = [
            {id: "1", created_at: 0},
            {id: "2", deadline: {type: DeadlineType.Date, date: 0}, created_at: -1},
            {id: "3", deadline: {type: DeadlineType.Date, date: -1}, created_at: 2},
            {id: "4", priority: 2, created_at: -1}
        ];

        const listId = "my-list";

        let store = TaskStore.make().addingListId(listId);
        tasks.forEach((task, idx) => {
            const added = store.addingTask(listId, task);
            expect(added === store).toEqual(false);

            expect(added.getTask(listId, task.id)).toEqual(task);

            expect(added.containsTask(listId, task.id)).toEqual(true);
            expect(store.containsTask(listId, task.id)).toEqual(false);

            expect(added.allTasks(listId)!.size).toEqual(idx + 1);
            expect(store.allTasks(listId)!.size).toEqual(idx);

            expect(added.orderedTaskIds(listId)!.size).toEqual(idx + 1);
            expect(store.allTasks(listId)!.size).toEqual(idx);

            expect(() => task.sdf = "").toThrow();
            expect(() => task.created_at = 3).toThrow();

            store = added;

            expectInOrder(store, listId, compareTasks);
        });
    });

    it("adds tasks in order and returns a new store (custom comparator)", () => {
        const tasks: Task[] = [
            {id: "1", created_at: 0},
            {id: "2", deadline: {type: DeadlineType.Date, date: 0}, created_at: -1},
            {id: "3", deadline: {type: DeadlineType.Date, date: -1}, created_at: 2},
            {id: "4", priority: 2, created_at: -1}
        ];

        const comparator = (a: Task, b: Task) => -compareTasks(a, b);
        const listId = "my-list";

        let store = TaskStore.make(comparator).addingListId(listId);
        tasks.forEach((task, idx) => {
            const added = store.addingTask(listId, task);
            expect(added === store).toEqual(false);

            expect(added.getTask(listId, task.id)).toEqual(task);

            expect(added.containsTask(listId, task.id)).toEqual(true);
            expect(store.containsTask(listId, task.id)).toEqual(false);

            expect(added.allTasks(listId)!.size).toEqual(idx + 1);
            expect(store.allTasks(listId)!.size).toEqual(idx);

            expect(added.orderedTaskIds(listId)!.size).toEqual(idx + 1);
            expect(store.allTasks(listId)!.size).toEqual(idx);

            expect(() => task.sdf = "").toThrow();
            expect(() => task.created_at = 3).toThrow();

            store = added;

            expectInOrder(store, listId, comparator);
        });
    });
});

describe("updatingTask()", () => {
    it("throws on unknown list IDs", () => {
        expect(() => TaskStore.make().updatingTask("my-list", {id: "1", created_at: 0})).toThrow();
    });

    it("throws on unknown tasks", () => {
        const list = "my-list";
        const store = TaskStore.make().addingListId(list);
        expect(() => store.updatingTask(list, {id: "1", created_at: 0})).toThrow();
    });

    it("updates tasks in order", () => {
        const tasks: Task[] = [
            {id: "1", created_at: 0},
            {id: "2", created_at: -1},
            {id: "3", created_at: 2},
            {id: "4", created_at: -2}
        ];

        const comparator = (a: Task, b: Task) => -compareTasks(a, b);
        const listId = "my-list";

        let store = tasks.reduce((store, task) => store.addingTask(listId, task), TaskStore.make(comparator).addingListId(listId));

        tasks.forEach((old) => {
            const task = Object.assign({}, old);
            task.created_at *= -1;

            const updated = store.updatingTask(listId, task);
            expect(updated === store).toEqual(false);

            expect(updated.getTask(listId, task.id)).toEqual(task);

            expect(updated.containsTask(listId, task.id)).toEqual(true);
            expect(store.containsTask(listId, task.id)).toEqual(true);

            expect(updated.allTasks(listId)!.size).toEqual(tasks.length);
            expect(store.allTasks(listId)!.size).toEqual(tasks.length);

            expect(updated.orderedTaskIds(listId)!.size).toEqual(tasks.length);
            expect(store.allTasks(listId)!.size).toEqual(tasks.length);

            expect(() => task.sdf = "").toThrow();
            expect(() => task.created_at = 3).toThrow();

            store = updated;

            expectInOrder(store, listId, comparator);
        });
    });
});

it("stress test", () => {
    let store = TaskStore.make();

    ["my-list", "sdfasdf", "asdfqewr", "sdf"].forEach(list => {
        store = store.addingListId(list);

        for (let i = 0; i < 5000; i++) {
            store = store.addingTask(list, {id: i.toString(), created_at: i});
        }
    })
});

export default undefined;