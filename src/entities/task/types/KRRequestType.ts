import { ResponsibleType } from "@/shared/types/responsibleType"


export type KRItemUpdateRequest = {
    [key:string]: any,
    id: string,
    login: string,
}

export type KRListByOKRReadRequest = {
    login: string,
    idParent: string,
}

export type KRListByKRReadRequest = {
    login: string,
    idKR: string,
}

export type KRItemReadRequest = {
    login: string,
    id: string,
    shortList?: boolean,
}

export type KRItemDeleteRequest = {
    id: string,
    login: string,
}