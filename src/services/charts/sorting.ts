import {SortablePoint} from "@models/graphData";

/**
 * Sorts an array of graph data points by time (year, month, optional date/hour/minute).
 * Supports nested arrays for multi-conversation data.
 */
export function sortGraphDataPointsTimeWise<T extends SortablePoint>(
    graphDataPoints: T[][] | T[],
    hasDate: boolean=false,
    hasHourAndMinute: boolean=false,
): Promise<T[][] | T[]> {
    const sortData = (data: T[]): T[] =>
        data.sort((a, b) => {
            const aDate = new Date(
                a.year,
                a.month,
                hasDate && "date" in a ? a.date : 1,
                hasHourAndMinute && "hour" in a ? a.hour : 0,
                hasHourAndMinute && "minute" in a ? a.minute : 0
            );
            const bDate = new Date(
                b.year,
                b.month,
                hasDate && "date" in b ? b.date : 1,
                hasHourAndMinute && "hour" in b ? b.hour : 0,
                hasHourAndMinute && "minute" in b ? b.minute : 0
            );
            return aDate.getTime() - bDate.getTime();
        });

    return Promise.resolve(
        Array.isArray(graphDataPoints[0])
            ? (graphDataPoints as T[][]).map(sortData)
            : sortData(graphDataPoints as T[])
    );
}

/**
 * Sorts an array of strings in "year-month" format chronologically.
 */
export function sortYearMonthKeys(keys: string[]): string[] {
    return keys.sort((a, b) => {
        const [aYear, aMonth] = a.split("-").map(Number);
        const [bYear, bMonth] = b.split("-").map(Number);

        if (aYear !== bYear) {
            return aYear - bYear;
        }
        return aMonth - bMonth;
    });
}

