export type MetricValuesType = {
    [key: string] : any;
    index?: string | boolean | number,
    plan?: string | null,
    fact?: string | null,
    quartal?: string | undefined | null,
    month?: string | undefined | null,
}