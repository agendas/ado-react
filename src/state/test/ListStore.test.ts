import TaskListStore from "../ListStore";

describe("make()", () => {
    it("initializes an empty store", () => {
        const store = TaskListStore.make();
        expect(Array.from(store.all()).length).toEqual(0);
        expect(store.orderedIds.size).toEqual(0);
        expect(store.ordered.size).toEqual(0);
    });
});

describe("adding()", () => {
    it("adds lists and returns a new store", () => {
        const list = {id: "1", location: ""};

        const store = TaskListStore.make();
        const added = store.adding(list);
        expect(Array.from(added.all()).length).toEqual(1);
        expect(added.orderedIds.size).toEqual(1);
        expect(added.ordered.size).toEqual(1);
        expect(store !== added);
    });

    it("deep freezes lists", () => {
        const list = {id: "1", name: "Test", test: {test: "12"}, location: ""};

        TaskListStore.make().adding(list);
        expect(() => list.test.test = "Test 2").toThrow();
        expect(() => (list.test as any).sdf = "Test 2").toThrow();
    });

    it("throws on duplicate lists", () => {
        const list = {id: "1", location: ""};
        const other = {id: "1", name: "different but not", location: ""};

        const store = TaskListStore.make();
        expect(() => store.adding(list).adding(other)).toThrow();
    });

    it("orders lists according to location", () => {
        const locations = ["1", "2", "1.1", "3", "0", "5", "4.4", "4", "2.5"];

        let store = TaskListStore.make();
        locations.forEach((location, id) => {
           store = store.adding({id: id.toString(), location});
        });

        locations.sort();
        expect(store.orderedIds.toArray()).toEqual(store.ordered.map(list => list.id).toArray());
        expect(store.ordered.map(list => list.location).toArray()).toEqual(locations);
    });
});

describe("updating()", () => {
    it("updates lists and returns a new store", () => {
        const list = {id: "1", location: ""};
        const store = TaskListStore.make().adding(list);

        const updated = store.updating(Object.assign({name: "Hello"}, list));
        expect(updated.get(list.id)!.name).toEqual("Hello");
        expect(store !== updated);
    });

    it("deep freezes lists", () => {
        const list = {id: "1", location: ""};
        const updatedList = {id: "1", name: "Hello", test: {test: "12"}, location: ""};
        TaskListStore.make().adding(list).updating(updatedList);

        expect(() => updatedList.test.test = "test").toThrow();
        expect(() => (updatedList.test as any).sdf = "test").toThrow();
    });

    it("throws on unknown lists", () => {
       expect(() => TaskListStore.make().updating({id: "1", location: ""})).toThrow();
    });

    it("does not affect list ordering if location does not change", () => {
        const ids = ["1", "2", "1.1", "3", "0", "5", "4.4", "4", "2.5"];

        let store = TaskListStore.make();
        ids.forEach(id => {
            store = store.adding({id, location: id});
        });

        ids.forEach(id => {
            const before = store.orderedIds;
            store = store.updating({id, name: "Hello", location: id});
            expect(store.orderedIds).toEqual(before);
        })
    });

    it("changes list ordering if location changes", () => {
        const ids = ["1", "2", "1.1", "3", "0", "5", "4.4", "4", "2.5"];

        let store = TaskListStore.make();
        ids.forEach(id => {
            store = store.adding({id, location: id});
        });

        const newLocations = ["3", "2", "2.4", "5", "6", "5", "7.5", "1", "2.5"];

        ids.forEach((id, idx) => {
            store = store.updating({id, name: "Hello", location: newLocations[idx]});
        });

        expect(store.ordered.map(list => list.location).toArray()).toEqual(newLocations.sort());
    });
});

describe("deleting()", () => {
    it("deletes lists and returns a new store", () => {
        const list = {id: "1", location: ""};

        const store = TaskListStore.make().adding(list);
        const deleted = store.deleting(list.id);
        expect(Array.from(deleted.all()).length).toEqual(0);
        expect(deleted.orderedIds.size).toEqual(0);
        expect(deleted.ordered.size).toEqual(0);
        expect(store !== deleted);
    });

    it("throws on unknown lists", () => {
        expect(() => TaskListStore.make().deleting("test")).toThrow();
    });

    it("orders lists according to location", () => {
        const ids = ["1", "2", "1.1", "3", "0", "5", "4.4", "4", "2.5"];

        let store = TaskListStore.make();
        ids.forEach(id => {
            store = store.adding({id, location: id});
        });

        let sorted = Array.from(ids).sort();

        ids.forEach(id => {
            store = store.deleting(id);
            sorted.splice(sorted.indexOf(id), 1);
            expect(store.orderedIds.toArray()).toEqual(sorted);
            expect(store.ordered.map(list => list.id).toArray()).toEqual(sorted);
        });
    });
});

describe("get()", () => {
    it("returns lists", () => {
        const list = {id: "1", location: ""};
        expect(TaskListStore.make().adding(list).get(list.id)).toBe(list);
    });

    it("returns undefined for unknown lists", () => {
        expect(TaskListStore.make().get("test")).toBeUndefined();
    });
});

describe("contains()", () => {
    it("returns true if store contains list", () => {
        const list = {id: "1", location: ""};
        expect(TaskListStore.make().adding(list).contains(list.id)).toEqual(true);
    });

    it("returns false if store does not contain list", () => {
        expect(TaskListStore.make().contains("test")).toEqual(false);
    });
});

export default undefined;