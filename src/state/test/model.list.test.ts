import modelReducer from "../model";
import {AdoModelAction, AdoModelOperations, AdoModelTypes, AdoStateNamespaces, ModelState} from "../interfaces";

let state: ModelState = {lists: new Map(), tasks: new Map()};
let namespace: AdoStateNamespaces.model = AdoStateNamespaces.model;

let type: AdoModelTypes.list = AdoModelTypes.list;

describe("Add", () => {
    let operation: AdoModelOperations.add = AdoModelOperations.add;

    it("adds lists", () => {
        let list = {
            id: "asdf",
            location: "1.2.3.4"
        };

        let action: AdoModelAction = {namespace, type, operation, list};
        let reduced = modelReducer(state, action);

        expect(reduced.tasks.size).toEqual(1);
        expect(reduced.tasks.get(list.id)!.size).toEqual(0);
        expect(reduced.lists.size).toEqual(1);
        expect(reduced.lists.get(list.id)).toEqual(list);
    });

    it("copies lists before adding them", () => {
        let location = "1.2.3.4";
        let list = {
            id: "asdf",
            location,
            test: {test: location}
        };

        let action: AdoModelAction = {namespace, type, operation, list};
        let reduced = modelReducer(state, action);

        list.test.test = "2.3.4.5";

        expect(reduced.lists.get(list.id)!.test.test).toEqual(location);
    });

    it("overwrites lists", () => {
        let list = {
            id: "asdf",
            location: "1.2.3.4"
        };

        let action: AdoModelAction = {namespace, type, operation, list};
        let reduced = modelReducer(state, action);

        list.location = "2.3.4.5";
        reduced = modelReducer(reduced, action);

        expect(reduced.tasks.size).toEqual(1);
        expect(reduced.tasks.get(list.id)!.size).toEqual(0);
        expect(reduced.lists.size).toEqual(1);
        expect(reduced.lists.get(list.id)!.location).toEqual(list.location);
    });

    it("makes lists immutable", () => {
        let id = "asdf";

        let action: AdoModelAction = {namespace, type, operation, list: {id, location: "1.2.3.4"}};
        let reduced = modelReducer(state, action);

        expect(() => reduced.lists.get(id)!.location = "1234").toThrow();
        expect(() => reduced.lists.get(id)!.sdf = "1234").toThrow();
    });
});

describe("Bulk Add", () => {
    let operation: AdoModelOperations.bulkAdd = AdoModelOperations.bulkAdd;

    it("bulk adds lists", () => {
        let lists = [
            {
                id: "asdf",
                location: "1.2.3.4"
            },
            {
                id: "asdf2",
                location: "1.2.3.45"
            }
        ];

        let action: AdoModelAction = {namespace, type, operation, lists};
        let reduced = modelReducer(state, action);

        expect(reduced.tasks.size).toEqual(lists.length);
        expect(reduced.lists.size).toEqual(lists.length);

        lists.forEach(list => {
            expect(reduced.tasks.get(list.id)!.size).toEqual(0);
            expect(reduced.lists.get(list.id)).toEqual(list);
        });
    });

    it("copies lists before adding them", () => {
        let lists = [
            {
                id: "asdf",
                location: "1.2.3.4"
            },
            {
                id: "asdf2",
                location: "1.2.3.45"
            }
        ];

        let action: AdoModelAction = {namespace, type, operation, lists};
        let reduced = modelReducer(state, action);

        lists.forEach(list => {
            let old = list.location;
            list.location = "2.3.4.5";
            expect(reduced.lists.get(list.id)!.location).toEqual(old);
        });
    });

    it("overwrites lists", () => {
        let lists = [
            {
                id: "asdf",
                location: "1.2.3.4"
            },
            {
                id: "asdf2",
                location: "1.2.3.45"
            }
        ];

        let reduced = modelReducer(state, {namespace, type, operation, lists});
        lists.forEach(list => {
            list.location = list.id;
        });
        reduced = modelReducer(reduced, {namespace, type, operation, lists});

        expect(reduced.tasks.size).toEqual(lists.length);
        expect(reduced.lists.size).toEqual(lists.length);

        lists.forEach(list => {
            expect(reduced.lists.get(list.id)).toEqual(list);
        });
    });

    it("makes lists immutable", () => {
        let lists = [
            {
                id: "asdf",
                location: "1.2.3.4"
            },
            {
                id: "asdf2",
                location: "1.2.3.45"
            }
        ];

        let reduced = modelReducer(state, {namespace, type, operation, lists});

        lists.forEach(list => {
            expect(() => reduced.lists.get(list.id)!.location = "1234").toThrow();
            expect(() => reduced.lists.get(list.id)!.sdf = "1234").toThrow();
        });
    });
});

describe("Set", () => {
    let operation: AdoModelOperations.set = AdoModelOperations.set;

    it("creates new lists for unknown IDs", () => {
        let list = {
            id: "asdf",
            location: "1.2.3.4"
        };

        let action: AdoModelAction = {namespace, type, operation, list};
        let reduced = modelReducer(state, action);

        expect(reduced.tasks.size).toEqual(1);
        expect(reduced.tasks.get(list.id)!.size).toEqual(0);
        expect(reduced.lists.size).toEqual(1);
        expect(reduced.lists.get(list.id)).toEqual(list);
    });

    it("copies lists before setting them", () => {
        let location = "1.2.3.4";
        let list = {
            id: "asdf",
            location
        };

        let reduced = modelReducer(state, {namespace, type, operation: AdoModelOperations.add, list: {id: "asdf", location: "1.2.3.4"}});
        reduced = modelReducer(reduced, {namespace, type, operation, list});

        list.location = "2.3.4.5";

        expect(reduced.lists.get(list.id)!.location).toEqual(location);
    });

    it("sets lists", () => {
        let list = {
            id: "asdf",
            location: "1.2.3.4"
        };

        let action: AdoModelAction = {namespace, type, operation, list};
        let reduced = modelReducer(state, action);

        list.location = "2.3.4.5";
        reduced = modelReducer(reduced, action);

        expect(reduced.tasks.size).toEqual(1);
        expect(reduced.tasks.get(list.id)!.size).toEqual(0);
        expect(reduced.lists.size).toEqual(1);
        expect(reduced.lists.get(list.id)!.location).toEqual(list.location);
    });

    it("makes lists immutable", () => {
        let location = "1.2.3.4";
        let list = {
            id: "asdf",
            location
        };

        let reduced = modelReducer(state, {namespace, type, operation: AdoModelOperations.add, list: {id: "asdf", location: "1.2.3.4"}});
        reduced = modelReducer(reduced, {namespace, type, operation, list});

        list.location = "2.3.4.5";

        expect(() => reduced.lists.get(list.id)!.location = "1234").toThrow();
        expect(() => reduced.lists.get(list.id)!.sdf = "1234").toThrow();
    });
});

describe("Update", () => {
    let operation: AdoModelOperations.update = AdoModelOperations.update;

    it("ignores unknown IDs", () => {
        let action: AdoModelAction = {
            namespace, type, operation, id: "asdf", property: "asdf", value: "asdf"
        };
        let reduced = modelReducer(state, action);
        expect(reduced.tasks.size).toEqual(0);
        expect(reduced.lists.size).toEqual(0);
    });

    /*
     * TODO: Rest of model tests
     * We need to make more complete tests to guarantee stability in future Ado versions,
     * but as of now this isn't really a priority.
     */
});

export default undefined;