import {ReducerRegistry} from "../reducer";
import {AdoReducer, AdoStateNamespaces} from "../interfaces";

let noopReducer: AdoReducer = (_a, _b) => ({});

describe("constructor", () => {
    it("creates a reducer registry with the model reducer", () => {
        let registry = new ReducerRegistry();
        expect(registry.isRegistered(AdoStateNamespaces.model)).toEqual(true);
        expect(registry.isRegistered("asdfoqwerqwer")).toBe(false);
    });

    it("creates an empty reducer registry using an empty map", () => {
        let registry = new ReducerRegistry(new Map());
        expect(registry.isRegistered(AdoStateNamespaces.model)).toEqual(false);
    });

    it("creates a reducer registry with reducers from a map", () => {
        let namespaces = ["this", "is", "a", "test", "ad;fjasldfjhapoiwehr"];
        let registry = new ReducerRegistry(new Map(namespaces.map(namespace => [namespace, noopReducer])));
        namespaces.forEach(namespace => expect(registry.isRegistered(namespace)).toEqual(true));
    });
});

describe("register()", () => {
    it("registers reducers", () => {
        let registry = new ReducerRegistry();
        let namespace = "asdfjpaoshf";
        registry.register(namespace, noopReducer);
        expect(registry.isRegistered(AdoStateNamespaces.model)).toEqual(true);
        expect(registry.isRegistered(namespace)).toEqual(true);
    });

    it("throws on duplicate namespaces", () => {
        let registry = new ReducerRegistry();
        let namespace = "asdfjpaoshf";
        registry.register(namespace, noopReducer);
        expect(() => registry.register(AdoStateNamespaces.model, noopReducer))
            .toThrow(new Error(`Namespace "${AdoStateNamespaces.model}" already exists in registry`));
        expect(() => registry.register(namespace, noopReducer))
            .toThrow(new Error(`Namespace "${namespace}" already exists in registry`));
        expect(registry.isRegistered(AdoStateNamespaces.model)).toEqual(true);
        expect(registry.isRegistered(namespace)).toEqual(true);
    });
});

describe("deregister()", () => {
    it("deregisters reducers", () => {
        let registry = new ReducerRegistry();
        let namespace = "asdfasdf";
        registry.register(namespace, noopReducer);
        registry.deregister(AdoStateNamespaces.model);
        expect(registry.isRegistered(namespace)).toBe(true);
        expect(registry.isRegistered(AdoStateNamespaces.model)).toBe(false);
    });

    it("throws on unknown namespaces", () => {
        let registry = new ReducerRegistry();
        let namespace = "asdfadfa";
        expect(() => registry.deregister(namespace))
            .toThrow(new Error(`Namespace ${namespace} does not exist in registry`));
        expect(registry.isRegistered(namespace)).toBe(false);
        expect(registry.isRegistered(AdoStateNamespaces.model)).toBe(true);
    });
});

describe("reduce()", () => {
    it("routes actions to the correct reducer", () => {
        let registry = new ReducerRegistry(new Map());

        let aCount = 0;
        let bCount = 0;

        let aReducer: AdoReducer = (state, _) => {
            aCount++;
            return state;
        };
        let bReducer: AdoReducer = (state, _) => {
            bCount++;
            return state;
        };

        registry.register("a", aReducer);
        registry.register("b", bReducer);

        registry.reduce({}, {namespace: "thisreducernamewillneverbepickedandifyoudopickitpleaseknowthatyouvebrokenmytests", type: null});
        expect(aCount).toEqual(0);
        expect(bCount).toEqual(0);

        registry.reduce({}, {namespace: "a", type: null});
        expect(aCount).toEqual(1);
        expect(bCount).toEqual(0);

        registry.reduce({}, {namespace: "b", type: null});
        expect(aCount).toEqual(1);
        expect(bCount).toEqual(1);
    });

    it("returns a reduced state", () => {
        let namespace = "test";
        let result = "cheese";
        let registry = new ReducerRegistry(new Map([[
            namespace,
            (_a, _b) => {
                return result;
            }
        ]]));

        let expected: Record<string, string> = {};
        expected[namespace] = result;

        expect(registry.reduce({}, {namespace: "test", type: null})).toEqual(expected);
    });

    it("returns an unchanged state for an unknown operation", () => {
        let registry = new ReducerRegistry();
        let state = {};
        expect(registry.reduce(state, {
            namespace: "thisreducernamewillneverbepickedandifyoudopickitpleaseknowthatyouvebrokenmytests",
            type: null
        })).toStrictEqual(state);
    });
});

export default undefined;