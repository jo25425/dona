/**
 * Checks that an item at a certain index of an array is greater than a certain value
 */
function indexAboveValue(index: number, value: number): (array: number[]) => boolean {
    return (array: number[]) => array[index] > value;
}

/**
 * Returns true for a negative number, false otherwise.
 * 0 is considered positive.
 */
const isNegative = (num: number) => num < 0;

/**
 * Given an array of arrays and an index, groups the inner arrays by the value at the index provided.
 * See test cases for a better understanding of this function.
 */
function groupArrayByValueAtIndex<T extends any[]>(
    array: T[],
    index: number
): T[][] {
    const map = new Map<string, T[]>();
    array.forEach(item => {
        const key = item[index].toString();
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(item);
    });
    return Array.from(map.values());
}

export { indexAboveValue, isNegative, groupArrayByValueAtIndex };
