import {NestedObject} from "./types/env.ts";
import {SearchStack} from "./types/utils.ts";

export const getAllValuesByPath = (obj: NestedObject, path: string) => {
    const keys = path.split('.');
    const results = [];
    const stack: SearchStack[] = [{ obj, index: 0 }];

    while (stack.length > 0) {
        const { obj, index } = stack.pop() as SearchStack;

        if (index === keys.length) {
            results.push(obj);
            continue;
        }

        const key = keys[index];

        if (Array.isArray(obj)) {
            for (let item of obj) {
                stack.push({ obj: item, index });
            }
        } else if (obj && typeof obj === 'object' && key in obj) {
            stack.push({ obj: obj[key], index: index + 1 });
        }
    }

    return results;
};

