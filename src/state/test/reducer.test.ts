import {ReducerRegistry} from "../reducer";
import {AdoReducer} from "../interfaces";

describe("reduce()", () => {
    it("routes actions to all reducers", () => {
        let registry = new ReducerRegistry();

        let aCount = 0;
        let bCount = 0;

        let aReducer: AdoReducer = (state = {}, _) => {
            aCount++;
            return state;
        };
        let bReducer: AdoReducer = (state = {}, _) => {
            bCount++;
            return state;
        };

        registry.register(aReducer);
        registry.register(bReducer);

        registry.reduce({}, {type: "thisreducernamewillneverbepickedandifyoudopickitpleaseknowthatyouvebrokenmytests"});
        expect(aCount).toEqual(1);
        expect(bCount).toEqual(1);
    });

    it("returns a reduced state", () => {
        let result = "cheese";
        let registry = new ReducerRegistry([(a = {}, _b) => ({...a, result})]);

        let expected: Record<string, string> = {};
        expected.result = result;

        expect(registry.reduce({}, {type: "thisreducernamewillneverbepickedandifyoudopickitpleaseknowthatyouvebrokenmytests"})).toEqual(expected);
    });

    it("returns an unchanged state for an unknown operation", () => {
        let registry = new ReducerRegistry();
        let state = {};
        expect(registry.reduce(state, {
            type: "thisreducernamewillneverbepickedandifyoudopickitpleaseknowthatyouvebrokenmytests"
        })).toStrictEqual(state);
    });
});

export default undefined;