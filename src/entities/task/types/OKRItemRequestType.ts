import IResponsible from "@/entities/user/types/IResponsible";

export type OKRItemCreateRequest = {
    login: string,
    complexity?: number | null,
    description?: string | null,
    dueDate?: string | null,
    idStrategy?: string | null,
    idOKR?: string,
    priority?: 0 | 1,
    progress?: number,
    responsibles?: IResponsible[],
    startDate?: null | string,
    status?: string,
    statusCheckin?: string,
    tags?: string [] | null,
    title: string,
    business?: string | null,
    createLogin?: string | null,
    idParent?: string | null,
    customer?: string,
}

export type OKRItemUpdateRequest = {
    [key:string]: any,
    id: string,
    login: string,
}

export type OKRListReadRequest = {
    login: string,
    shortList?: boolean,
}

export type OKRItemReadRequest = {
    login: string,
    id: string,
}

export type OKRItemDeleteRequest = {
    id: string,
    login: string,
}