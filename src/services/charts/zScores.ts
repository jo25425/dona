import { mean, sum } from "lodash";

/**
 * Calculates z-scores for sent and received counts in graph data, clamping scores within a given limit.
 * Adds the `zScore` property directly to input objects.
 */
export function ZScoreCalcPolarPlot<T extends { sentCount: number; receivedCount: number; zScore?: number }>(
    data: T[][],
    zScoreLimitArg: number
): void {
    const flattened = data.flat();
    const sums = flattened.map((obj) => obj.sentCount + obj.receivedCount);

    // Calculate mean and standard deviation
    const dataMean = mean(sums) as number;
    const dataStdDev = Math.sqrt(
        sum(sums.map((value) => Math.pow(value - dataMean, 2))) / sums.length
    );

    flattened.forEach((obj, index) => {
        let zScore = (sums[index] - dataMean) / dataStdDev;
        zScore = Math.max(-zScoreLimitArg, Math.min(zScore, zScoreLimitArg));
        obj.zScore = zScore;
    });
}

