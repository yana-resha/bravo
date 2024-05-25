import { MetricaItemType } from "./MetricaItemType";

export type MetricaCreateRequest = {
    [key: string]: any,
    login: string,
    title: MetricaItemType['title'],
    description?: MetricaItemType['description'],
    unit?: MetricaItemType['unit'],
    metricValues?: MetricaItemType['metricValues'],
    indicators?: MetricaItemType['indicators'],
    dueDate?: MetricaItemType['dueDate'],
    period?: MetricaItemType['period'],
    startDate: MetricaItemType['startDate'],
    taskType: MetricaItemType['taskType'],
    responsibles?: MetricaItemType['responsibles']
}

export type MetricaUpdateRequest = {
    [key: string]: any,
    id: string,
    login: string,
    title?: MetricaItemType['title'],
    description?: MetricaItemType['description'],
    unit?: MetricaItemType['unit'],
    metricValues?: MetricaItemType['metricValues'],
    indicators?: MetricaItemType['indicators'],
    dueDate?: MetricaItemType['dueDate'],
    period?: MetricaItemType['period'],
    startDate: MetricaItemType['startDate'],
    taskType: MetricaItemType['taskType'],
    responsibles?: MetricaItemType['responsibles']
}

export type MetricListRequest = {
    login: string,
    idStrategyMetric?:string | number,
}

export type MetricItemByIdRequest = {
    login: string,
    id: string,
}

export type MetricDeleteRequest = {
    login: string,
    id: string,
}