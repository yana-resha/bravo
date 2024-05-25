import { ResponsibleType } from "@/shared/types/responsibleType";

export interface IStrategyTargetShort {
    id: string,
    title: string
}

export interface IStrategyTarget extends IStrategyTargetShort {
    responsibles: ResponsibleType[] | null,
    createDate: string,
    updateDate: string,
    createLogin: string,
    updateLogin: string,
    createFIO: string,
    updateFIO: string,
    cntMetric: any,
    cntOKR: any,
    id: string,
    taskType: "strategy"
}

export interface IStrategyCreateRequest {
    login: string,
    title: string,
    responsibles: ResponsibleType[] | null,
}

export interface IStrategyReadRequest {
    login: string,
    id: string,
}

export interface IStrategyUpdateRequest extends IStrategyReadRequest{
    title?: string,
    responsibles: ResponsibleType[] | null,
}