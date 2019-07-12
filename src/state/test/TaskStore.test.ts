import {TaskStore} from "../TaskStore";

describe("make()", () => {
    it("initializes an empty store", () => {
        const store = TaskStore.make();
        expect(Array.from(store.allListIds()).length).toEqual(0);
    });
});

export default undefined;