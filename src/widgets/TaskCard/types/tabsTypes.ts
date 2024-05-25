export enum TaskCardTabsID {
    card = 1,
    checkin = 2,
    approvals = 3,
}

export type TabType = {
    icon?: React.ReactNode,
    count?: number,
    label: string,
    id: TaskCardTabsID,
    active: boolean,
}