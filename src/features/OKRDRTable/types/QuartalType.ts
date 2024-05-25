import { OKRItemType } from "@/entities/task/types/OKRItemType"

export type QuartalType = {
    label: string,
    nextDayQuartal: string,
}

export type QuartalValues = {
    tasks: OKRItemType[],
    isLoading: boolean,
    complexitySum: number,
}

export type ChangeQuartalValuesFunc = <K extends keyof QuartalValues,>(quartal: QuartalValuesType['nextDayQuartal'], key: K, value: QuartalValuesType[K]) => void;

export type QuartalValuesType = QuartalType & QuartalValues;