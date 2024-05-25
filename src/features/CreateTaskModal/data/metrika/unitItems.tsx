import { StrategyMetricaItemType } from "@/entities/strategyMetrica/types/StrategyMetricaItemType"

export type UnitType = {
    id: StrategyMetricaItemType['unit'],
    label: string,
    icon:  React.ReactNode | React.ReactElement | string,
}

export const unitItems: UnitType[]= [
    {
        id: 'Рублевая',
        label: 'Рублевая',
        icon: <i className="las la-ruble-sign"></i>,
    },
    {
        id: 'Процентная',
        label: 'Процентная',
        icon: <i className="las la-percent"></i>,
    },

    {
        id: 'Числовая',
        label: 'Числовая',
        icon: <i>#</i>,
    },

    {
        id: 'NPS',
        label: 'NPS',
        icon: <i>N</i>,
    },
]
