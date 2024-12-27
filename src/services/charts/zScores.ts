import _ from "lodash";

export const calculateZScores = (data: number[], limit: number) => {
    const mean = _.mean(data);
    const stdDev = Math.sqrt(_.mean(data.map((val) => Math.pow(val - mean, 2))));
    return data.map((value) => {
        let z = (value - mean) / stdDev;
        if (z > limit) z = limit;
        if (z < -limit) z = -limit;
        return z;
    });
};