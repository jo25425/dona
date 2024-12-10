import {WithZScore, SortablePoint, SentReceivedPoint} from "@models/graphData";
import { sortGraphDataPointsTimeWise, sortYearMonthKeys } from "@services/charts/sorting";
import { ZScoreCalcPolarPlot } from "@services/charts/zScores";

export async function preparePolarChartData<T extends SortablePoint>(
    dataMonthlyPerConversation: SentReceivedPoint[][]
): Promise<{
    sortedData: WithZScore<T>[][];
    sortedKeys: string[];
}> {
    const zScoreLimit = 1.96; // Default limit for z-scores
    ZScoreCalcPolarPlot(dataMonthlyPerConversation, zScoreLimit);

    const sortedData = await sortGraphDataPointsTimeWise(
        dataMonthlyPerConversation
    ) as WithZScore<T>[][];

    const keys = sortedData.flat().map(({ year, month }) => `${year}-${month}`);
    const sortedKeys = sortYearMonthKeys([...new Set(keys)]);

    return {
        sortedData,
        sortedKeys
    };
}
