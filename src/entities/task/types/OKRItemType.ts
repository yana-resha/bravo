import { CheckinStatus } from "@/entities/checkIn";
import { ResponsibleType } from "@/shared/types/responsibleType";
import { OKRStatusItem } from "./OKREnums";
import IResponsible from "@/entities/user/types/IResponsible";

export type OKRItemType = {
    [key:string]: any,
    id: string,
    chldrn: number | null,
    complexity: number | null,
    ciSeen: string | null,
    cicreateDate: string | null,
    createDate: string | null,
    createFIO: string | null,
    createLogin: string | null,
    description: string | null,
    dueDate: string | null,
    idStrategy?: string | null,
    idParent?: string | null,
    priority: 0 | 1,
    progress: number,
    responsibleFIO: string,
    responsibles: ResponsibleType [],
    startDate: null | string,
    status: OKRStatusItem | null,
    statusCheckin: CheckinStatus,
    tags: string [] | null,
    business: string | null,
    taskType: 'OKR',
    title: string,
    titleStrategy: string | null,
    updateDate: string | null,
    updateLogin: string | null,
    calcType: number | string,
    waitfor: number | null,
    weight: number,
    customer?: IResponsible | null,
    isCheck: boolean,
};

export type OKRItemTypeShort = {
    id: string,
    title: string
}

