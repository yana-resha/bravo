import IResponsible from "@/entities/user/types/IResponsible"

export type CreateTaskSettings = {
    type?: 'OKR' | 'KR' | 'metric' | 'strategyMetric' | null,
    idStrategy?: string | null,
    parentID?: string | null,
    initialResponsibles?: IResponsible[],
}

export type ModalProps = {
    closeFunc: () => void,
    taskID?: string | null,
    type?: 'OKR' | 'KR' | 'metric' | 'strategyMetric' | null,
    createSettings?: CreateTaskSettings,
}