import { ResponsibleType } from "@/shared/types/responsibleType";

export type  StrategyMetricaItemType = {
    [key:string]: any,
    id: string | number,
    createDate: string | null,
    createFIO: string | null,
    createLogin: string | null,
    description: string | null,
    dueDate: string | null,
    indicators: {id: string, type: 'strategy'} [],
    pf: {
        fact: number | null,
        plan: number | null, 
        month: string | null,
        qfact: number | null,
        qplan: number | null,
        quartal: string | null,
    }[],
    period: "Ежемесячно" | "Ежеквартально",
    unit: "Рублевая" | "Процентная" | "Числовая" | "NPS",
    startDate: null | string,
    taskType: 'strategyMetric',
    title: string,
    updateDate: string | null,
    updateLogin: string | null,
    updateFIO: string | null,
    responsibles: ResponsibleType[]
};
