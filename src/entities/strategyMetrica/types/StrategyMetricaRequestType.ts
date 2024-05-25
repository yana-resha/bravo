import { StrategyMetricaItemType } from "./StrategyMetricaItemType"


export type StrategyMetricaCreateRequest = {
    [key: string]: any,
    login: string,
    title: StrategyMetricaItemType['title'],
    description?: StrategyMetricaItemType['description'],
    unit?: StrategyMetricaItemType['unit'],
    metricValues?: StrategyMetricaItemType['metricValues'],
    indicators?: StrategyMetricaItemType['indicators'],
    dueDate?: StrategyMetricaItemType['dueDate'],
    period?: StrategyMetricaItemType['period'],
    startDate: StrategyMetricaItemType['startDate'],
    responsibles?: StrategyMetricaItemType['responsibles']
}

export type StrategyMetricaUpdateRequest = {
    [key: string]: any,
    id: string,
    login: string,
    title?: StrategyMetricaItemType['title'],
    description?: StrategyMetricaItemType['description'],
    unit?: StrategyMetricaItemType['unit'],
    metricValues?: StrategyMetricaItemType['metricValues'],
    indicators?: StrategyMetricaItemType['indicators'],
    dueDate?: StrategyMetricaItemType['dueDate'],
    period?: StrategyMetricaItemType['period'],
    startDate: StrategyMetricaItemType['startDate'],
    responsibles?: StrategyMetricaItemType['responsibles']
}

export type MetricListRequest = {
    login: string,
    idStrategy?: string | number,
    shortList?: boolean,
}

export type MetricItemByIdRequest = {
    login: string,
    id: string,
}

export type StrategyMetricDeleteRequest = {
    login: string,
    id: string,
}