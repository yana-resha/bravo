import { useState } from "react";
import { MetricValuesType } from "../../../types/MetricValues";

export function useMetricValues () {
    const [metricValues, setMetricValues] = useState<MetricValuesType []>([]);

    return {
        metricValues, setMetricValues
    }
}