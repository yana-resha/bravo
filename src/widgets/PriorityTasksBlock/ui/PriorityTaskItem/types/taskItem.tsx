import { CheckinStatus } from "@/entities/checkIn";

export type taskItem = {
    id: string,
    level: number,
    taskName: string,
    title: string,
    description?: string,
    responsibles?: any,
    complexity: number,
    createDate: string,
    progress: number,
    strategy: any,
    statusCheckin: CheckinStatus
}

export type taskItemTest = {
    id: number | string,
    level: number,
    taskName: string,
    title: string,
    description?: string,
}

export type taskItemProps = {
    task: taskItem,
}