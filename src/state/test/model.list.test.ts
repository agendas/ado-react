import modelReducer from "../model";
import {AdoModelAction, AdoModelOperations, AdoModelTypes, AdoStateNamespaces, ModelState} from "../interfaces";

let state: ModelState = {lists: new Map(), tasks: new Map()};
let namespace: AdoStateNamespaces.model = AdoStateNamespaces.model;

let type: AdoModelTypes.list = AdoModelTypes.list;

let add: AdoModelAction = {namespace, type, operation: AdoModelOperations.add, list: {id: "id", location: "1.2.3.4"}};

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

    it("updates properties", () => {
        let property = "asdf";
        let value = "asdf2";
        let reduced = modelReducer(modelReducer(state, add), {namespace, type, operation, id: add.list.id, property, value});

        let extraProps: Record<string, any> = {};
        extraProps[property] = value;

        expect(reduced.tasks.size).toEqual(1);
        expect(reduced.lists.size).toEqual(1);
        expect(reduced.lists.get(add.list.id)).toEqual(Object.assign({}, add.list, extraProps));
        expect(reduced.lists.get(add.list.id)![property]).toEqual(value);
    });

    it("updates existing properties", () => {
        let property = "location";
        let value = "asdf2";
        let reduced = modelReducer(modelReducer(state, add), {namespace, type, operation, id: add.list.id, property, value});

        let extraProps: Record<string, any> = {};
        extraProps[property] = value;

        expect(reduced.tasks.size).toEqual(1);
        expect(reduced.lists.size).toEqual(1);
        expect(reduced.lists.get(add.list.id)).toEqual(Object.assign({}, add.list, extraProps));
        expect(reduced.lists.get(add.list.id)![property]).toEqual(value);
    });

    it("deep clones properties", () => {
        let property = "asdf";
        let test = {test: {test: 1}};
        let reduced = modelReducer(modelReducer(state, add), {namespace, type, operation, id: add.list.id, property, value: test});

        test.test.test++;

        expect(reduced.lists.get(add.list.id)![property].test.test).toEqual(test.test.test - 1);
    });

    it("throws on ID modification", () => {
        let withList = modelReducer(state, add);
        expect(() => modelReducer(withList, {namespace, type, operation, id: add.list.id, property: "id", value: "1234"}))
            .toThrow(new Error("Attempt to change ID of list"));
    });

    it("makes lists immutable", () => {
        let reduced = modelReducer(modelReducer(state, add), {namespace, type, operation, id: add.list.id, property: "asdf", value: {test: 2}});
        expect(() => reduced.lists.get(add.list.id)!.asdf = "sdf").toThrow();
        expect(() => reduced.lists.get(add.list.id)!.test = "sdf").toThrow();
        expect(() => reduced.lists.get(add.list.id)!.asdf.test = "sdf").toThrow();
        expect(() => reduced.lists.get(add.list.id)!.asdf.test2 = "sdf").toThrow();
    });
});

describe("Delete", () => {
    let operation: AdoModelOperations.delete = AdoModelOperations.delete;

    it("deletes lists", () => {
        let reduced = modelReducer(modelReducer(state, add), {namespace, type, operation, id: add.list.id});
        expect(reduced.tasks.size).toEqual(0);
        expect(reduced.lists.size).toEqual(0);
    });

    it("ignores unknown IDs", () => {
        let reduced = modelReducer(modelReducer(state, add), {namespace, type, operation, id: "thisisanunknownidblah"});
        expect(reduced.tasks.size).toEqual(1);
        expect(reduced.lists.size).toEqual(1);
    });
});

export default undefined;