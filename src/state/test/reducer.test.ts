import {ReducerRegistry} from "../reducer";
import {AdoReducer} from "../interfaces";

describe("reduce()", () => {
    it("routes actions to the correct reducer", () => {
        let registry = new ReducerRegistry({});

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

        registry.register(["a"], aReducer, "a");
        registry.register(["a", "b"], bReducer, "b");

        registry.reduce({}, {namespace: "thisreducernamewillneverbepickedandifyoudopickitpleaseknowthatyouvebrokenmytests", type: null});
        expect(aCount).toEqual(0);
        expect(bCount).toEqual(0);

        registry.reduce({}, {namespace: "a", type: null});
        expect(aCount).toEqual(1);
        expect(bCount).toEqual(1);

        registry.reduce({}, {namespace: "b", type: null});
        expect(aCount).toEqual(1);
        expect(bCount).toEqual(2);
    });

    it("returns a reduced state", () => {
        let namespace = "test";
        let result = "cheese";
        let registry = new ReducerRegistry({test: [{property: "test", reducer: (_a, _b) => result}]});

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