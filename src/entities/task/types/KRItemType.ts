import { CheckinStatus } from "@/entities/checkIn/types/CheckinType"
import { ResponsibleType } from "@/shared/types/responsibleType"
import { OKRStatusItem } from "./OKREnums"


export type KRItemType = {
    business: string | null,
    taskType: 'KR',
    id: string,
    chldrn: number | null,
    description: string | null,
    title: string,
    idOKR?: string | null,
    idParent?: string | null,
    idKR: string | null,
    titleKR: string | null,
    titleOKR: string | null,
    responsibles: ResponsibleType[],
    progress: number,
    status: OKRStatusItem | null,
    statusCheckin: CheckinStatus,
    startDate: null | string,
    dueDate: null | string,
    createDate: string,
    updateDate: null | string,
    createLogin: null | string,
    createFIO: null | string,
    updateLogin: null | string,
    updateFIO: null | string,
    cntKR: number,
    complexity: number | null,
    tags: string[] | null,
    waitfor: number | null,
    weight: number,
    calcType: number | string,
    isCheck: boolean,
}

export type KRItemShortType = {
    [key: string] : any,
    id: string,
    title: string,
}