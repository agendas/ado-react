import deepFreezeStrict from "deep-freeze-strict";
import deepSeal from "deep-seal";

export function isDefined(value: any) {
    return value !== undefined && value !== null;
}

export function makeImmutable<T>(o: T) {
    deepFreezeStrict(deepSeal(o));
}

export type Optional<T> = T | undefined;