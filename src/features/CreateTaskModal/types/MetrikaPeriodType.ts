import { StrategyMetricaItemType } from "@/entities/strategyMetrica/types/StrategyMetricaItemType";

export type MetrikaPeriodType = {
    id: StrategyMetricaItemType['period'],
    label: 'Ежемесячно' | 'Ежеквартально',
}